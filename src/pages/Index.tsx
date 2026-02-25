const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <span className="text-foreground font-semibold text-lg">CARLOS</span>
          </div>
        </div>
      </header>
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground">Welcome to CARLOS</h1>
          <p className="text-xl text-muted-foreground">AI-Powered TIC Platform by THT</p>
        </div>
      </main>
    </div>
  );
};

export default Index;
