import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from "axios"
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const url = "https://maestrogeekapp.herokuapp.com/data/"

class App extends Component  {

    constructor(props){
        super(props);
        this.state={
            data:[],
            modalInsertar: false,
            modalEliminar: false,
            form:{
                id: "",
                nombres: "",
                apellidos: "",
                telefono: "",
                direccion: ""
            },
            tipoModal: ""

        }
    }

    componentDidMount(){
        this.peticionGet();
    }

    modalInsertar=() =>{
        this.setState({modalInsertar: !this.state.modalInsertar})
    }

    handleChange= async(e)=> {
        e.persist();
        await this.setState({
            form:{
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        })
        console.log(this.state.form)

    }

   

    seleccionarUsuario = (usuario) =>{
        this.setState({
            tipoModal: 'actualizar',
            form:{
                id: usuario.id,
                nombres: usuario.nombres,
                apellidos: usuario.apellidos,
                telefono: usuario.telefono,
                direccion: usuario.direccion
            }
        })
        console.log(usuario)
    }

   
    peticionGet =()=>{
        axios.get(url)
        .then(res => {
            this.setState({data: res.data})
        }).catch(error=> {
            console.log(error.message)
        })
    }

    peticionPost= async()=>{
        delete this.state.form.id;
        await axios.post(url, this.state.form)
        .then(res =>{
            this.modalInsertar();
            this.peticionGet();
        }).catch(error =>{
            console.log(error.message)
        })
    }

    peticionPut= async() => {
        await axios.put(url+this.state.form.id,this.state.form)
        .then(res =>{
            this.modalInsertar();
            this.peticionGet();
        }).catch(error =>{
            console.log(error.message)
        })
    }

    peticionDelete = async () =>{
        await axios.delete(url+this.state.form.id)
        .then(res => {
            this.setState({modalEliminar: false});
            this.peticionGet();
        }).catch(error =>{
            console.log(error.message)
        })
    }

    // state={
    //     data:[]
    // }

    // peticionGet=()=>{
    //     axios.get(url).then(response=>{
    //         this.setState({data: response.data})
    //         // localStorage.setItem("Datos",JSON.stringify(data.find))
    //     })
    // }

    // componentDidMount(){
    //     this.peticionGet()

    // }
    render(){
        const {form} = this.state;
  return (
    <div className='App'>
        <br/>
        <button className='btn btn-success' 
        onClick={()=> {this.setState({form: null, tipoModal: 'insertar'}); this.modalInsertar()}}
        >Agregar usuario</button>
        <br/>
        <table className='table'>
            <thead>
                <tr>
                    <th>Registro</th>
                    <th>Nombres</th>
                    <th>Apellidos</th>
                    <th>Telefono</th>
                    <th>Direccion</th>
                </tr>
            </thead>
            
            <tbody>
                {this.state.data.map(usuario =>{
                    return(
                        <tr key={usuario.id}>
                        <td>{usuario.id}</td>    
                        <td>{usuario.nombres}</td>
                        <td>{usuario.apellidos}</td>
                        <td>{usuario.telefono}</td>
                        <td>{usuario.direccion}</td>
                        <td>
                            <button className='btn btn-info' 
                            onClick={()=>{this.seleccionarUsuario(usuario);this.modalInsertar()}}>editar</button>
                            <button className='btn btn-danger'
                            onClick={()=>{this.seleccionarUsuario(usuario); this.setState({modalEliminar: true})}}
                            >eliminar</button>
                        </td>
                        </tr>
                    
                    )
                })}
            </tbody>
        </table>

        <Modal isOpen={this.state.modalInsertar}>
                    <h1>Crear Usuario</h1>
                    <ModalHeader style={{display: 'block'}}>
                        <span style={{float: 'right'}} onClick={()=> this.modalInsertar()}>x</span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                        <label htmlFor="id">Id</label>
                            <input className="form-control" type="text" name="id" id="id" readOnly onChange={this.handleChange} value={form?form.id:''}/>
                            <br/>
                            <label htmlFor="nombres">Nombres</label>
                            <input className="form-control" type="text" name="nombres" id="nombres"  onChange={this.handleChange} value={form?form.nombres:''}/>
                            <br/>
                            <label htmlFor="apellidos">Apellidos</label>
                            <input className="form-control" type="text" name="apellidos" id="apellidos"  onChange={this.handleChange} value={form?form.apellidos:''}/>
                            <br/>
                            <label htmlFor="telefono">Teléfono</label>
                            <input className="form-control" type="text" name="telefono" id="telefono"  onChange={this.handleChange} value={form?form.telefono:''}/>
                            <br/>
                            <label htmlFor="direccion">Dirección</label>
                            <input className="form-control" type="text" name="direccion" id="direccion"  onChange={this.handleChange} value={form?form.direccion:''}/>
                            <br/>

 
                        </div>
 
                    </ModalBody>
                    <ModalFooter>
                      {this.state.tipoModal==='insertar'}
                        <button className="btn btn-success" onClick={() => this.peticionPost()}>
                            Insertar
                        </button>
                        <button className="btn btn-primary" onClick={()=> this.peticionPut()}
                        >
                            Actualizar
                        </button>
                        <button className="btn btn-danger"
                        onClick={()=> this.modalInsertar()}
                           >
                            Cancelar
                        </button>
                    </ModalFooter>
                </Modal>
 
                <Modal isOpen={this.state.modalEliminar}>
                    <ModalBody>
                        Está seguro de eliminar el usuario {form && form.nombre}
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-danger"
                        onClick={()=> this.peticionDelete()}
                       >Sí</button>
                        <button className="btn btn-secundary"
                        onClick={()=> this.setState({modalEliminar: false})}
                       >No</button>
                    </ModalFooter>
                </Modal>


    </div>


    // <div className="containerApp">

    //         <div className="Registro py-5 container text-center">
    //            <form className="form-signin">
    //                <h1 className="h3 mb-3 font-weight-normal">
    //                    ¡Registrate en nuestro sistema!
    //                </h1>
    //                <div className="fadeIn first ">
    //                    <img 
    //                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS689Xb1GJwNGzZl9KR7CTRKAZFaXt1060H32xPbb8hw_NXNpJ409Sl-aLnPsJQUfKJnYEV_KndttR1bbUKS_f7DGE3OP59H1Y&usqp=CAU&ec=45725305" 
    //                    id="icon" 
    //                    alt="User Icon" 
    //                    width="100px"/>
    //                    <h3>Crea una cuenta</h3>
    //                </div>
   
    //                <input
    //                    type="text"
    //                    name="nombre"
    //                    className="form-control"
    //                    placeholder="nombre"
    //                    required=""
   
    //                />
   
    //                <input
    //                    type="text"
    //                    name="apellido"
    //                    className="form-control"
    //                    placeholder="Apellido"
    //                    autoComplete="off"
   
    //                    required=""
   
    //                />
   
                   
   
    //                <input
    //                    type="text"
    //                    name="telefono"
    //                    className="form-control"
    //                    placeholder="Telefono"
    //                    required=""
   
    //                />
   
    //                <input
    //                    type="tect"
    //                    name="direccion"
    //                    className="form-control"
    //                    placeholder="Direccion"
    //                    required=""
   
    //                />
    //                <br />
    //                <button
    //                    type="submit"
    //                    className="btn btn-primary btn-block mb-1"
    //                >
    //                    Register
    //                </button>
    //                <br />
    //            </form>
    //     </div>
         
    // </div>
)
}
}

export default App