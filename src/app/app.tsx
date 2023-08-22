// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';
import { MarketDataMap } from './map/map';

import NxWelcome from './nx-welcome';

export function App() {
  return (
    <div>
      <MarketDataMap />
    </div>
  );
}

export default App;
