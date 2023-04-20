import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

//NOTE: deleted <React.StrictMode> because it causes rendering twice in development mode
root.render(<App/>);

