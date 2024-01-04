import Footer from './components/common/Footer';
import Header from './components/common/Header';
import TopPage from './components/top/TopPage';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow">
        <TopPage />
      </div>
      <Footer />
    </div>
  );
}

export default App;
