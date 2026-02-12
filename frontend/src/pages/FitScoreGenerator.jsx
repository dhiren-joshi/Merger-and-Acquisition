import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import FitScoreForm from '../components/fitScore/FitScoreForm';

export default function FitScoreGenerator() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="flex">
                <Sidebar />

                <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Fit Score Generator</h1>
                        <p className="text-gray-600 mt-2">
                            Create a new deal and generate an intelligent fit score
                        </p>
                    </div>

                    <FitScoreForm />
                </main>
            </div>
        </div>
    );
}
