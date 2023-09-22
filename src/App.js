import { useEffect, useState } from 'react';
import './App.css';
import Container from './components/Container/Container';
import Error from './components/Error/Error';
import Loading from './components/Loading/Loading';
import StudentList from './components/StudentList/StudentList';
import TestStats from './components/TestStats/TestStats';

const API_URL = process.env.REACT_APP_API_URL;
const NUM_TESTS = 8; // TODO: don't hard code this number

function App() {
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState('');

  useEffect(() => {
    console.log('<App /> useEffect() fired');
    async function fetchData() {
      try {
        // Remove any errors from previous attempts
        setError('');
        // Show the user that we're loading...
        setLoading(true);
        const response = await fetch(`${API_URL}/v2/students?include=grades`);
        const json = await response.json();
        console.log('<App /> useEffect() fetched data', json);
        const { data, error } = json;
        if (response.ok) {
          // handle success
          setStudentData(data);
          // Stop showing the user the loading UI...
          setLoading(false);
        } else {
          // handle error
          setError(error);
          setLoading(false);
        }
      } catch (err) {
        console.log(`<App /> useEffect error: ${err.message}`);
        setError(err.message);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const closeModal = () => {
    setModalOpen('');
  };

  const renderContent = () => {
    if (loading) {
      return <Loading />;
    } else if (error) {
      return <Error error={error} />;
    } else {
      return (
        <StudentList
          showTestStats={() => setModalOpen('testStats')}
          studentData={studentData}
        />
      );
    }
  };

  const groupGradesByTest = (studentData) => {
    const gradesByTest = [];
    for (let i = 0; i < NUM_TESTS; i++) {
      gradesByTest.push([]);
    }

    studentData.forEach((student) => {
      const { grades } = student;
      for (let i = 0; i < grades.length; i++) {
        const currScore = grades[i].score;
        gradesByTest[i].push(currScore);
      }
    });
    return gradesByTest;
  };
  console.log(
    `<App /> rendered! error= ${error} loading = ${loading} num students = ${studentData.length}`
  );
  return (
    <div className="App">
      {!loading && !error && (
        <TestStats
          isOpen={modalOpen === 'testStats'}
          closeModal={closeModal}
          tests={groupGradesByTest(studentData)}
        />
      )}
      <Container center={Boolean(error || loading)} scroll={false}>
        {renderContent()}
      </Container>
    </div>
  );
}

export default App;
