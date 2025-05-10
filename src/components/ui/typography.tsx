"use client";

export const TypographyH1 = () => (
  <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
    Taxing Laughter: The Joke Tax Chronicles
  </h1>
);

export const TypographyH2 = ({ title }: { title: string }) => (
  <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
    {title}
  </h2>
);
