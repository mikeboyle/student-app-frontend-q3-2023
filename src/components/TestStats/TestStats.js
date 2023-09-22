import Modal from 'react-modal';
import './TestStats.css';
Modal.setAppElement('#root');

const getScoreStats = (scores) => {
  let total = 0;
  let min = 101;
  let max = -1;

  for (const score of scores) {
    total += score;
    min = Math.min(min, score);
    max = Math.max(max, score);
  }

  return {
    mean: total / scores.length,
    min,
    max,
  };
};

const TestStats = ({ closeModal, isOpen, tests }) => {
  return (
    <Modal isOpen={isOpen} className="TestStats__content">
      <div className="TestStats__top">
        <h1>Test Stats</h1>
        <button onClick={closeModal}>X</button>
      </div>
      <div className="TestStats__stats">
        {tests.map((test, index) => {
          const { mean, min, max } = getScoreStats(test);
          return (
            <div key={index}>
              <h2>Test {index + 1}</h2>
              <ul>
                <li>average: {mean.toFixed(2)}%</li>
                <li>min: {min.toFixed(2)}%</li>
                <li>max: {max.toFixed(2)}%</li>
              </ul>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

export default TestStats;
