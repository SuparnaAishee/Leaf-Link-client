

export default function layout({ children }:{children:React.ReactNode}) {
  return (
    <div className="relative flex flex-col h-screen">
   
      <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
        {children}
      </main>
    </div>
  );
}
