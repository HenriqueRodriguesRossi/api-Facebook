const User = require("../models/User");
const yup = require("yup");
const bcrypt = require("bcryptjs");
const captureErrorYup = require("../utils/captureErroYup");
const jwt = require("jsonwebtoken")

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

        const emailValidate = await User.findOne({
            email
        })

        if(emailValidate){
            return res.status(422).send({
                mensagem: "Esse email já foi cadastrado!"
            })
        }

        const passwordHash = await bcrypt.hash(password, 20);

        const newUser = new User({
            first_name,
            last_name,
            email,
            password: passwordHash,
            gender
        });

        await newUser.save();
        
        return res.status(201).send({
            mensagem: "Usuário cadastrado com sucesso!"
        })
    } catch (error) {
        const errors = []
        if (error instanceof yup.ValidationError) {
            errors.push(captureErrorYup(error)) ;
            return res.status(500).send({
                errors 
            });
        } else {
            console.error(error);
            return res.status(500).send({
                mensagem: "Erro ao efetuar o cadastro!"
            });
        }
    }
}

exports.login = async (req, res)=>{
    try{
        const {email, password} = req.body 

        if(!email || !password){
            return res.status(400).send({
                mensagem: "Todos os campos devem ser preenchidos!"
            })
        }
    
        const user = await User.findOne({
            email
        })
    
        const checkPass = await bcrypt.compare(password, user.password)
        
        if(!user || !checkPass){
            return res.status(404).send({
                mensagem: "Email ou senha estão incorretos!"
            })
        }

        const secret = process.env.SECRET

        const token = jwt.sign({
            id: user._id
        }, secret)

        return res.status(200).send({
            mensagem: "Login efetuado com sucesso!",
            token: token
        })
    }catch(error){
        console.log(error)
        return res.status(500).send({
            mensagem: "Erro ao efeutar o login!"
        })
    }
    
}