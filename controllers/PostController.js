const Post = require("../models/Post");
const fs = require('fs/promises'); 

exports.newPost = async (req, res) => {
    try {
        const { description } = req.body;
        const file = req.file;

        const postData = {}

        if(description){
            postData.description = description
        }

        if(file){
            postData.src = file.src
        }

        if(Object.keys(postData).length === 0){
            return res.status(400).send({
                mensagem: "Pelo menos um dos campos deve ser preenchido!"
            })
        }

        const newPost = new Post(postData)

        await newPost.save()

        return res.status(201).json({
            mensagem: "Post cadastrado com sucesso!",
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao cadastrar post!",
            error: error.message, // Adiciona a mensagem de erro ao retorno
        });
    }
};

exports.searchPosts = async (req, res) => {
    try {
        const { description } = req.body;

        if (!description) {
            return res.status(400).json({
                mensagem: "A descrição é obrigatória!",
            });
        }

        // Use uma expressão regular para buscar descrições que contenham a description
        const regex = new RegExp(description, 'i');

        // Adicione um filtro para excluir posts do usuário autenticado
        const posts = await Post.find({
            description: regex,
            user: { $ne: req.userId } // $ne significa "não igual"
        });

        // Mapeie os resultados para extrair apenas os campos desejados
        const result = posts.map(post => ({
            description: post.description,
            src: post.src || null, // Se não houver src, defina como null
        }));

        if(result.length == 0){
            return res.status(404).send({
                mensagem: "Nenhum post encontrado!"
            })
        }else{
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
};

exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.id; // Corrigir aqui

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                mensagem: 'Post não encontrado.',
            });
        }

        const userId = req.user.id; // Corrigir aqui para obter o ID do usuário autenticado

        if (post.userId !== userId) {
            return res.status(403).json({ mensagem: 'Você não tem permissão para excluir este post.' });
        }

        if (post.src) {
            await fs.unlink(post.src);
        }

        await Post.findByIdAndDelete(postId);

        return res.status(200).json({ mensagem: 'Post excluído com sucesso.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: 'Erro ao excluir o post.' });
    }
};