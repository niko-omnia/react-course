const Header = ({text}) => {
  return (
    <div>
      <h1>{text}</h1>
    </div>
  )
}

const Part = ({ part }) => {
  return (
    <div>
      <h2>Name: {part.name}</h2>
      <p>Exercises: {part.exercises}</p>
    </div>
  )
}

const Total = ({ parts }) => {
  const total = parts.map(part => part.exercises).reduce((x, y) => x+y);
  
  return (
    <div>
      <h2>Total exercises: {total}</h2>
    </div>
  )
}

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map(part => (
        <Part key={part.id} part={part} />
      ))}
    </div>
  )
}

export const Course = ({ course }) => {
  return (
    <div>
      <Header text={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
      <br></br>
    </div>
  )
}
