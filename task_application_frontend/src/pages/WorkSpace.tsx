import Footer from 'src/components/common/Footer';
import Header from 'src/components/common/Header';
import WorkSpaceComp from 'src/components/workspace/WorkSpaceComp';

export default function WorkSpace() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow">
        <WorkSpaceComp />
      </div>
      <Footer />
    </div>
  );
}
