const MarqueeText = () => {
  const text = "Women in Digital Business";
  
  return (
    <div className="relative overflow-hidden py-8 border-y border-primary/30">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...Array(20)].map((_, i) => (
          <span key={i} className="text-2xl md:text-3xl font-bold mx-8 text-foreground/50">
            {text} •
          </span>
        ))}
      </div>
    </div>
  );
};

export default MarqueeText;
