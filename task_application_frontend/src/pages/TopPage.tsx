import Footer from 'src/components/common/Footer';
import Header from 'src/components/common/Header';
import TopPageComp from 'src/components/top/TopPageComp';

export default function TopPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow">
        <TopPageComp />
      </div>
      <Footer />
    </div>
  );
}
