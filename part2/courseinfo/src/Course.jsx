

const Header = ({ course }) => {
  return (
    <h1>{course.name}</h1>
  )
}

const Course = ({ course }) => {
  return (
    <div> 
      <Header course={course} />
      <Content parts={course.parts} />
    </div>
  )
}

const Content = ({ parts }) => {
  const total = parts.reduce((sum, part) => sum + part.exercises, 0)
  return (
    <div>
      {parts.map(part => <Part key={part.id} part={part} />)}
      <p><strong>total of {total} exercises</strong></p>
    </div>
  )
}

const Part = ({ part }) => {
  return (
    <p>{part.name} {part.exercises}</p>
  )
}

export default Course