import { Link } from 'react-router-dom';

/**
 * Home Page Component
 * 
 * This is the landing page users see when they first open the app.
 * It provides navigation to the main features.
 */
function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Lineageweaver
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Fantasy Genealogy Visualization for Worldbuilders
          </p>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                Family Trees
              </h2>
              <p className="text-gray-600 mb-4">
                Visualize complex family relationships with magical bloodlines, 
                non-human species, and intricate succession lines.
              </p>
              <Link 
                to="/tree" 
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                View Family Tree
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                Manage Data
              </h2>
              <p className="text-gray-600 mb-4">
                Add and edit people, houses, and relationships. 
                Build your world's genealogy one character at a time.
              </p>
              <Link 
                to="/manage" 
                className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Manage People & Houses
              </Link>
            </div>
          </div>

          {/* Info Section */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Getting Started
            </h3>
            <div className="text-left space-y-3 text-gray-600">
              <p>
                <strong>New to Lineageweaver?</strong> The app comes with sample data 
                showing House Valorian and House Silverwind to help you get started.
              </p>
              <p>
                You can explore the family tree view to see how relationships are displayed, 
                or go to the management page to add your own houses and characters.
              </p>
              <p>
                All data is stored locally in your browser, so you can work offline and 
                your genealogies stay private.
              </p>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-12 text-gray-500 text-sm">
            <p>Built for worldbuilders who need to track complex fantasy genealogies</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
