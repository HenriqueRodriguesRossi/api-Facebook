const Post = require("../models/Post");
const fs = require('fs/promises');
const yup = require('yup');
const checkToken = require("../utils/checkToken");
const router = require("express").Router()
const upload = require("../utils/multer")

router.post("/new-post", checkToken, upload.single("src"), async (req, res) => {
    try {
        const { description } = req.body;
        const file = req.file;

        const postData = {};

        if (description) {
            postData.description = description;
        }

        if (file) {
            postData.src = file.path; // Corrigir aqui
        }

        if (Object.keys(postData).length === 0) {
            return res.status(400).send({
                mensagem: "Pelo menos um dos campos deve ser preenchido!",
            });
        }

        // Validar dados usando Yup
        const postSchema = yup.object().shape({
            description: yup.string(),
            src: yup.string(),
        });

        await postSchema.validate(postData);

        const newPost = new Post(postData);
        await newPost.save();

        return res.status(201).json({
            mensagem: "Post cadastrado com sucesso!",
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao cadastrar post!",
            error: error.message,
        });
    }
})

router.get("/find-post",checkToken,  async (req, res) => {
    try {
        const { description } = req.body;

        if (!description) {
            return res.status(400).json({
                mensagem: "A descrição é obrigatória!",
            });
        }

        const regex = new RegExp(description, 'i');

        // Adicionado um filtro para excluir posts do usuário autenticado
        const posts = await Post.find({
            description: regex,
            userId: { $ne: req.userId },
        });

        // Mapear os resultados
        const result = posts.map(post => ({
            description: post.description,
            src: post.src || null,
        }));

        if (result.length === 0) {
            return res.status(404).send({
                mensagem: "Nenhum post encontrado!",
            });
        } else {
            return res.status(200).json({
                mensagem: "Busca realizada com sucesso!",
                result,
            });
        }
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao realizar a busca!",
            error: error.message,
        });
    }
})

router.delete("/delete-post/:id", checkToken, async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                mensagem: 'Post não encontrado.',
            });
        }

        // Certifique-se de que req.userId seja usado de forma consistente
        if (post.userId.toString() !== req.userId) {
            return res.status(403).json({ mensagem: 'Você não tem permissão para excluir este post.' });
        }

        if (post.src) {
            await fs.unlink(post.src);
        }

        await Post.findByIdAndDelete(postId);

        return res.status(200).json({ mensagem: 'Post excluído com sucesso.' });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: 'Erro ao excluir o post.',
            error: error.message,
        });
    }
})

module.exports = router