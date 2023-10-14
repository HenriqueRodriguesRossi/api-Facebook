const User = require("../models/User");
const yup = require("yup");
const bcrypt = require("bcryptjs");
const captureErrorYup = require("../utils/captureErroYup");
const jwt = require("jsonwebtoken");

const isEmailAlreadyRegistered = async (email) => {
    const existingUser = await User.findOne({ email });
    return !!existingUser;
};

exports.newUser = async (req, res) => {
    try {
        const { first_name, last_name, email, password, gender } = req.body;

        const userSchema = yup.object().shape({
            first_name: yup.string().required('O nome completo é obrigatório!'),
            last_name: yup.string().required('O sobrenome é obrigatório!'),
            email: yup.string().email('Digite um email válido!').required('O email é obrigatório!'),
            password: yup.string()
                .min(6, 'A senha deve ter no mínimo 6 caracteres')
                .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/, 'A senha deve conter pelo menos uma letra, um número e um símbolo')
                .required('A senha é obrigatória!'),
            gender: yup.string().required('O gênero é obrigatório').oneOf(['Masculino', 'Feminino', 'Outro'], 'Gênero inválido'),
        });

        await userSchema.validate(req.body, { abortEarly: false });

        if (await isEmailAlreadyRegistered(email)) {
            return res.status(422).send({
                mensagem: "Esse email já foi cadastrado!",
            });
        }

        const passwordHash = await bcrypt.hash(password, 20);

        const newUser = new User({
            first_name,
            last_name,
            email,
            password: passwordHash,
            gender,
        });

        await newUser.save();

        return res.status(201).send({
            mensagem: "Usuário cadastrado com sucesso!",
        });
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            const errors = [captureErrorYup(error)];
            return res.status(500).send({ errors });
        } else {
            console.error(error);
            return res.status(500).send({
                mensagem: "Erro ao efetuar o cadastro!",
            });
        }
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({
                mensagem: "Todos os campos devem ser preenchidos!",
            });
        }

        const user = await User.findOne({
            email,
        });

        if (!user) {
            return res.status(404).send({
                mensagem: "Email ou senha estão incorretos!",
            });
        }

        const checkPass = bcrypt.compareSync(password, user.password);

        if (!checkPass) {
            return res.status(404).send({
                mensagem: "Email ou senha estão incorretos!",
            });
        }

        const secret = process.env.SECRET;

        // Atualizar o token no banco de dados
        const token = jwt.sign({
            id: user._id,
        }, secret);

        await User.findOneAndUpdate({ _id: user._id }, { token });

        return res.status(200).send({
            mensagem: "Login efetuado com sucesso!",
            token: token,
            id: user._id,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            mensagem: "Erro ao efetuar o login!",
        });
    }
};

exports.findUser = async (req, res) => {
    try {
        const { first_name, last_name } = req.body;

        if (!first_name && !last_name) {
            return res.status(400).send({
                mensagem: "Pelo menos um dos campos (first_name ou last_name) deve ser fornecido!",
            });
        }

        const filter = {};

        if (first_name) {
            filter.first_name = new RegExp(first_name, 'i');
        }

        if (last_name) {
            filter.last_name = new RegExp(last_name, 'i');
        }

        const users = await User.find(filter);

        const result = users.map(user => ({
            first_name: user.first_name,
            last_name: user.last_name || null,
        }));

        if (result.length === 0) {
            return res.status(404).send({
                mensagem: "Nenhum usuário encontrado!",
            });
        } else {
            return res.status(200).send({
                mensagem: "Pesquisa efetuada com sucesso!",
                result,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            mensagem: "Erro ao pesquisar usuário!",
        });
    }
}