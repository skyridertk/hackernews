import React, {Component} from 'react';
import './App.css';
import axios from 'axios';

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const DEFAULT_HPP = '100';
const PARAM_HPP = 'hitsPerPage=';

const list = [{
  title:'React',
  url:'https://facebook.github.io/react',
  author:'Jordan Walke',
  num_comments:3,
  points:4,
  objectID:2,
},{
  title:'Redux',
  url:'https://github.com/reactjs/redux',
  author:'Dan Abramov, Andrew Clark',
  num_comments:2,
  points:5,
  objectID: 1,
},{
  title:'Jsx',
  url:'https://github.com/reactjs/redux',
  author:'Javascript Corp',
  num_comments:10,
  points:2,
  objectID: 3,
}];
let searchTerm = 'redux';
let page = '0';
console.log(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`);

//const isSearched = searchTerm => item => item.title.toLowerCase().includes(searchTerm.toLowerCase());

export default class App extends Component{
  constructor(props){
    super(props);

    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null
    };
    //bind class methods to this if they want to access this
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
  }

  needsToSearchTopStories(searchTerm){
    return !this.state.results[searchTerm];
  }

  setSearchTopStories(result){
    const { hits, page } = result;
    const { searchKey, results }=this.state;

    const oldhits = results && results[searchKey]? results[searchKey].hits: [];

    const updatedHits = [
      ...oldhits,
      ...hits
    ];

    this.setState({
      results: {
        ...results, 
        [searchKey]: {hits: updatedHits, page}
      }
    });

  }

  fetchSearchTopStories(searchTerm, page=0){
    axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
    .then(result => this.setSearchTopStories(result.data))
    .catch(error => this.setState({error}));
  }

  onSearchSubmit(event){
    const { searchTerm } = this.state;
    this.setState({searchKey: searchTerm});

    if(this.needsToSearchTopStories(searchTerm)){
      this.fetchSearchTopStories(searchTerm);
    }
    event.preventDefault();
  }

  componentDidMount(){
    const{ searchTerm }=this.state;
    this.setState({searchKey: searchTerm});
    this.fetchSearchTopStories(searchTerm);
  }

  onDismiss(id){
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

    const updatedHits = hits.filter(item => item.objectID !== id);
    
    this.setState({
      results: {...results, 
        [searchKey]:{hits: updatedHits, page}
      }
    });
  }

  onSearchChange(event){
    this.setState({
      searchTerm: event.target.value,
    });
  }
  render(){
    const {searchTerm, results, searchKey, error} = this.state;
    const page = (results && results[searchKey] && results[searchKey].page) || 0;
    const list = (results && results[searchKey] && results[searchKey].hits) || [];

   

    return (
      <div className="page">
        <div className="interactions">
          <Search 
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
          <div>
            {error?
              <div className="interactions">
              <p>Something went wrong.</p>
              </div>
              :
            <Table 
                list={list}
                onDismiss={this.onDismiss}
              />
            }
    
          <div className="interactions">
            <Button onClick = {()=>this.fetchSearchTopStories(searchKey, page+1)}>
              More
            </Button>
          </div>
          </div>
        </div>
      </div>
    );
  }
}
 const Search = ({ value, onChange, onSubmit, children }) =>{
     return(
      <form onSubmit={onSubmit}>
        <input 
          type='text' 
          value={value}
          onChange={onChange}/>
          <button type="submit">
          {children}
          </button>
      </form>
     );
 }

 const Table = ({ list, onDismiss})=>{
     return(
       <div className="table">
         {list.map((item) =>{
           return(
             <div key={item.objectID} className="table-row">
               <span style={{width: '40%'}}>
                 <a href={item.url}>{item.title}</a>
               </span>
               <span style={{width: '30%'}}>{item.author}</span>
               <span style={{width: '20%'}}>{item.num_comments}</span>
               <span style={{width: '10%'}}>{item.points}</span>
               <span style={{width: '10%'}}>
                 <Button onClick = {()=>onDismiss(item.objectID)}
                  className="button-inline"
                 >
                   Dismiss 
                  </Button>
               </span>
             </div>
   
           );
           
         })}
       </div>
      
     );
   }

 const Button = ({onClick, className, children})=>{
     return(
       <button
        onClick={onClick}
        className={className}
        type="button"
        >
        {children}
        </button>
     );
 }