// Components/ProblematicComponent.jsx

function ProblematicComponent() {
    // We're defining a variable as null, then trying to access a property on it.
    // This will throw a TypeError, which our Error Boundary will catch.
    const user = null;
    return <div>{user.name}</div>;
}

export default ProblematicComponent;