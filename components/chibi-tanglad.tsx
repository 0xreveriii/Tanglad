import Image from "next/image";

const crumbs = Array.from({ length: 9 }, (_, index) => index);

export function ChibiTanglad() {
  return (
    <div
      className="chibi-stage"
      role="img"
      aria-label="A cute lemongrass sprout mascot peeking out of a mound of soil"
    >
      <span className="chibi-stage-haze" aria-hidden="true" />
      <span className="chibi-soil-shadow" aria-hidden="true" />

      <div className="chibi-mascot" aria-hidden="true">
        <Image
          src="/images/tanglad-chibi-mascot.png"
          alt=""
          width={1254}
          height={1254}
          priority
          sizes="(max-width: 767px) 92vw, (max-width: 1100px) 54vw, 640px"
        />
      </div>

      <span className="chibi-soil-back" aria-hidden="true" />
      <span className="chibi-soil-front" aria-hidden="true" />
      <span className="chibi-soil-ridge" aria-hidden="true" />

      <span className="chibi-soil-crumbs" aria-hidden="true">
        {crumbs.map((crumb) => <i key={crumb} />)}
      </span>
    </div>
  );
}