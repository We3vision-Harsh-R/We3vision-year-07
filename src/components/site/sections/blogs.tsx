import { GlowEdge } from "../glow-edge";
import { Img } from "../img";
import { Reveal } from "../reveal";
import { SmartLink } from "../smart-link";
import { ButtonLink, SectionHead, Wide } from "../ui";
import type { SectionComponent } from "./shared";

export const Blogs: SectionComponent<"blogs"> = ({ data }) => (
  <section id="blogs" className="py-24 sm:py-32">
    <Wide>
      <SectionHead chip={data.chip} heading={data.heading}>
        <ButtonLink href={data.buttonHref} variant="ghost">
          {data.buttonLabel}
        </ButtonLink>
      </SectionHead>
      <div className="mt-16 grid gap-6 sm:grid-cols-2">
        {data.items.map((post, i) => (
          <Reveal key={i} delay={i * 90} className="h-full">
            <SmartLink
              href={post.href || "#"}
              className="bglow card-glass group block h-full overflow-hidden rounded-[19px] border border-violet/[0.08] transition duration-300 hover:-translate-y-1 hover:border-violet/30 hover:shadow-[0_20px_50px_hsl(calc(var(--th)_+_350.29)_calc(63.64%_*_var(--ts))_43.14%_/_0.25)]"
            >
              <GlowEdge />
              <div className="relative aspect-[16/9] overflow-hidden">
                <Img src={post.image} alt="" className="size-full object-cover transition duration-500 group-hover:scale-105" />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[hsl(calc(var(--th)_+_346.97)_calc(58.49%_*_var(--ts))_10.39%)] via-transparent to-transparent" />
                {post.category && (
                  <span className="absolute left-4 top-4 rounded-full border border-violet/30 bg-void/70 px-3.5 py-1 text-sm font-medium text-violet backdrop-blur">{post.category}</span>
                )}
              </div>
              <h3 className="p-6 text-xl font-semibold leading-snug tracking-[-0.01em] text-violet">{post.title}</h3>
            </SmartLink>
          </Reveal>
        ))}
      </div>
    </Wide>
  </section>
);
