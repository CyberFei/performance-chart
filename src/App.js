import './App.css';
import ResourceTiming from './ResourceTiming';

import entries from './Mock/entries';

function App() {
  return (
    <div className='App'>
      <ResourceTiming entries={entries} />
    </div>
  );
}

export default App;
