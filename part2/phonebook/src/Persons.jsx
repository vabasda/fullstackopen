const Persons = (props) => {
  return (
    <div>{props.persons.map(person => <p key={person.name}>{person.name}  {person.number} 
    <button onClick={() => props.deletePerson(person.id)}>delete</button>
    </p>)}</div>
  )
}

export default Persons;