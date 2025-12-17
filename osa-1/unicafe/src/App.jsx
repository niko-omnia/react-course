import { useState } from 'react'

const StatisticsLine = ({ title, value }) => {
  return (
    <tr>
      <td>{title}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({ props }) => {
  if (props.total === 0) return (
    <div>
      <p>No feedback given</p>
    </div>
  )
  return (
      <div>
        <h1>statistics</h1>
        <table>
          <tbody>
            <StatisticsLine title="good" value={props.good} />
            <StatisticsLine title="neutral" value={props.neutral} />
            <StatisticsLine title="bad" value={props.bad} />
            <StatisticsLine title="average" value={props.average} />
            <StatisticsLine title="positive" value={props.positive} />
          </tbody>
        </table>
      </div>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const total = good + neutral + bad;
  const average = total === 0 ? 0 : (good - bad) / total;
  const positive = total === 0 ? 0 : (good / total) * 100;

  return (
    <div>
      <div>
        <h1>give feedback</h1>
        <button onClick={() => setGood(good + 1)}>good</button>
        <button onClick={() => setNeutral(neutral + 1)}>neutral</button>
        <button onClick={() => setBad(bad + 1)}>bad</button>
      </div>
      <Statistics props={{
        good,
        neutral,
        bad,
        total,
        average,
        positive
      }} />
    </div>
  )
}

export default App
