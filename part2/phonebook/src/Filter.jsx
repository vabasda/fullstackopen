const Filter = (props) => {
  return (
    <div>
      filter names: <input value={props.value} onChange={props.onChange} />
    </div>
  )
}

export default Filter;