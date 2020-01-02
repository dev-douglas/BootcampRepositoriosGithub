import React, { Component } from 'react'
import { Form, SubmitButton, List } from './style';
import { FaGithubAlt, FaPlus } from 'react-icons/fa';
import { FiLoader } from 'react-icons/fi';


import Container from '../../components/Container';

import { Link } from 'react-router-dom';

import api from '../../services/api';

export default class Main extends Component {

    constructor(props){
        super(props);
        this.state = {
            newRepo: '',
            repositories: [],
            loading: 0
        };

    }

    //Carregar os dados do localStorage
    componentDidMount(){
        const repositories = localStorage.getItem('repositories');

        if(repositories) {
            this.setState({ repositories: JSON.parse(repositories)});
        }
    }

    //Salvar os dados do localStorage
    componentDidUpdate(_, prevState){

        const { repositories } = this.state;

        if(prevState.repositories != repositories){
            localStorage.setItem('repositories', JSON.stringify(repositories));
        }

    }

    handleInputChange = e => {
        this.setState({ newRepo: e.target.value });
    }

    handleSubmit = async e => {
        e.preventDefault();//Para evitar o refresh da página

        this.setState({ loading: 1 });

        const {newRepo, repositories} = this.state;

        const response = await api.get(`/repos/${newRepo}`);

        const data = {
            name: response.data.full_name,
        }

        this.setState({
            repositories: [...repositories, data],
            newRepo: '',
            loading: 0
        })
    }

    render(){

        const { newRepo, repositories, loading } = this.state;

        return (
            <Container>
                <h1>
                    <FaGithubAlt/>
                    Repositorios
                </h1>

                <Form onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        placeholder="Adicionar repositório"
                        value={newRepo}
                        onChange={this.handleInputChange}
                    />
                    <SubmitButton loading={loading}>
                        {loading ? <FiLoader color="#FFF" size={14}/> : <FaPlus color="#FFF" size={14}/>}

                    </SubmitButton>
                </Form>
                <List>
                    {
                        repositories.map(repository => (
                            <li key={repository.name}>
                                <span>{repository.name}</span>
                                <Link to={`/repository/${encodeURIComponent(repository.name)}`}>Detalhes</Link>
                            </li>
                        ))
                    }
                </List>
            </Container>
        )
    }
}
