import React, { useState } from 'react';
import SearchAndToolsContainer from './toolsrelated/SearchAndToolsContainer.jsx';
import ComponentsContainer from './componentsrelated/ComponentsContainer.jsx';
import CodeSpaceContainer from './CodeSpaceContainer.jsx';

// Parent Container
export default function DashContainer() {
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [searchResults, setSearchResults] = useState([]);

    const handleComponentClick = (component) => {
        setSelectedComponent(component);
        console.log('Selected component:', component);
    };

    const handleSearchResults = (results) => {
        setSearchResults(results);
    };

    return (
        <div className="flex flex-col md:flex-row gap-2 p-8 h-full">
            {/* Left Column Widget */}
            <div className="w-4/12 p-2">
                <SearchAndToolsContainer 
                    selectedComponent={selectedComponent} 
                    onSearchResults={handleSearchResults} 
                />
                <ComponentsContainer 
                    searchResults={searchResults} 
                    onComponentClick={handleComponentClick} 
                />
            </div>

            {/* Right Column Widget */}
            <div className="w-8/12 p-2">
                <CodeSpaceContainer component={selectedComponent} />
            </div>
        </div>
    );
}
