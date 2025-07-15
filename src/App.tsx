import DiagramView from "./components/DiagramView"

const App = () => {
  return (
    <>
      <div className="h-screen bg-bg text-primary">
        <div className="flex flex-col items-center justify-center h-full">
          <DiagramView />
        </div>
      </div>
    </>
  )
}

export default App
