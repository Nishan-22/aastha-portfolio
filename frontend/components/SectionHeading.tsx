type SectionHeadingProps = {
  label: string;
  index: string;
  title: string;
  className?: string;
};

export default function SectionHeading({
  label,
  index,
  title,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`mb-12 ${className}`}>
      <p className="eyebrow">
        <span>{index}</span>
        {label}
      </p>
      <h2 className="display-md mt-5 max-w-3xl whitespace-pre-line">{title}</h2>
    </div>
  );
}