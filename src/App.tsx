import DiagramView from "./components/DiagramView"
import Footer from "./components/Footer"

const App = () => {
  return (
    <>
      <div className="h-screen bg-bg text-primary">
        <main className="flex flex-col items-center justify-center h-full">
          <DiagramView />
        </main>
        <Footer />
      </div>
    </>
  )
}

export default App
