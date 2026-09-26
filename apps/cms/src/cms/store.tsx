import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

import { nanoid } from "nanoid";

import {
  pageApi,
  useGetPageLinksQuery,
  useGetPageQuery,
  useUpdatePageMutation,
} from "@/services/pagesApi";

import type {
  CMSContextValue,
  CMSProviderProps,
  LinkType,
  Page,
  Pages,
  Section,
  SectionType,
} from "./Types";
import { useDispatch } from "react-redux";

/* ------------------------------------------------------------------ */
/* Context */
/* ------------------------------------------------------------------ */

const CMSContext = createContext<CMSContextValue | null>(null);

/* ------------------------------------------------------------------ */
/* Section Defaults */
/* ------------------------------------------------------------------ */

const SECTION_DEFAULTS: Record<SectionType, () => Section["props"]> = {
  hero: () => ({
    title: "New Hero",
    subtitle: "Subtitle",
    bg: "#020617",
  }),
  hero2: () => ({
    badge: {
      en: "New Season Drop — 24 styles just landed",
      ar: "وصلت تشكيلة الموسم الجديد — 24 تصميمًا جديدًا",
    },

    titleLine1: {
      en: "Step Into",
      ar: "خطوتك نحو",
    },

    titleHighlight: {
      en: "Greatness",
      ar: "العظمة",
    },

    titleLine3: {
      en: "Every Day.",
      ar: "كل يوم.",
    },

    description: {
      en: "Authentic premium sneakers from Nike, Jordan, Adidas, Yeezy and more. Verified legit, shipped fast, styled for the streets.",
      ar: "أحذية رياضية أصلية وفاخرة من Nike وJordan وAdidas وYeezy وغيرها. منتجات أصلية موثقة، شحن سريع، وأناقة تناسب الشوارع.",
    },

    primaryButton: {
      text: {
        en: "Shop The Drop",
        ar: "تسوق المجموعة الجديدة",
      },
      href: "#products",
    },

    secondaryButton: {
      text: {
        en: "Explore Brands",
        ar: "استكشف العلامات التجارية",
      },
      href: "#brands",
    },

    stats: [
      {
        id: nanoid(),

        value: {
          en: "500+",
          ar: "500+",
        },

        label: {
          en: "Premium Styles",
          ar: "تصميم فاخر",
        },
      },

      {
        id: nanoid(),

        value: {
          en: "12",
          ar: "12",
        },

        label: {
          en: "Top Brands",
          ar: "علامة تجارية",
        },
      },

      {
        id: nanoid(),

        value: {
          en: "4.9★",
          ar: "4.9★",
        },

        label: {
          en: "50k+ Reviews",
          ar: "أكثر من 50 ألف تقييم",
        },
      },
    ],

    featuredProduct: {
      id: nanoid(),

      badge: {
        en: "Featured",
        ar: "مميز",
      },

      brand: {
        en: "Air Jordan 1",
        ar: "إير جوردان 1",
      },

      name: {
        en: "Retro High Chicago",
        ar: "ريترو هاي شيكاغو",
      },

      price: {
        en: "$245",
        ar: "245$",
      },

      image: "",

      fallbackText: {
        en: "AJ1",
        ar: "AJ1",
      },
    },

    miniProduct: {
      id: nanoid(),

      brand: {
        en: "AD",
        ar: "AD",
      },

      name: {
        en: "Ultraboost",
        ar: "ألترا بوست",
      },

      image: "",
    },

    reviews: {
      rating: 5,

      text: {
        en: "50k+ verified reviews",
        ar: "أكثر من 50 ألف تقييم موثق",
      },
    },

    shipping: {
      title: {
        en: "Free Shipping",
        ar: "شحن مجاني",
      },

      value: {
        en: "Over $75",
        ar: "للطلبات فوق 75$",
      },
    },
  }),
  banner: () => ({
    slides: [
      {
        id: nanoid(),

        title: {
          en: "Step Into Your Style",
          ar: "اخطُ نحو أسلوبك",
        },

        subTitle: {
          en: "Discover the latest sneakers from the world's top brands.",
          ar: "اكتشف أحدث الأحذية الرياضية من أشهر العلامات التجارية العالمية.",
        },

        image: "",
      },
    ],
  }),
  sliderFeaturedProducts: () => ({
    products: [],
    title: "Featured Products",
    slider: false,
  }),

  CountDownOffers: () => ({
    offers: [],
    title: "Special Offers",
  }),

  CategorySecation: () => ({
    category: "",
    limit: 10,
    title: "Category Products",
  }),

  text: () => ({
    text: "New text section",
  }),
  brandMarquee: () => ({
    title: {
      en: "Authentic footwear from the world's leading brands",
      ar: "أحذية أصلية من أشهر العلامات التجارية العالمية",
    },

    brands: [
      {
        en: "Nike",
        ar: "نايكي",
      },
      {
        en: "Adidas",
        ar: "أديداس",
      },
      {
        en: "Jordan",
        ar: "جوردان",
      },
      {
        en: "New Balance",
        ar: "نيو بالانس",
      },
      {
        en: "Yeezy",
        ar: "ييزي",
      },
      {
        en: "Puma",
        ar: "بوما",
      },
      {
        en: "ASICS",
        ar: "أسكس",
      },
      {
        en: "Converse",
        ar: "كونفرس",
      },
      {
        en: "Vans",
        ar: "فانس",
      },
      {
        en: "Off-White",
        ar: "أوف وايت",
      },
      {
        en: "Travis Scott",
        ar: "ترافيس سكوت",
      },
      {
        en: "On Running",
        ar: "أون رنينغ",
      },
    ],
  }),
  features: () => ({
    heading: {
      en: "Loved by 50,000+",
      ar: "محبوب من أكثر من 50,000 عميل",
    },

    title1: {
      en: "Real Sneakerheads.",
      ar: "عشاق أحذية حقيقيون.",
    },

    title2: {
      en: "Real Reviews.",
      ar: "تقييمات حقيقية.",
    },

    features: [
      {
        id: nanoid(),

        title: {
          en: "100% Authentic",
          ar: "أصلي 100%",
        },

        description: {
          en: "Every pair verified by our team of authentication specialists.",
          ar: "يتم التحقق من أصالة كل زوج من قبل فريق متخصص في التوثيق.",
        },

        icon: "shield",
      },

      {
        id: nanoid(),

        title: {
          en: "Free Fast Shipping",
          ar: "شحن سريع ومجاني",
        },

        description: {
          en: "2-day shipping on all orders over $75. Always free returns.",
          ar: "شحن خلال يومين لجميع الطلبات التي تزيد قيمتها عن 75 دولارًا، مع إرجاع مجاني دائمًا.",
        },

        icon: "truck",
      },

      {
        id: nanoid(),

        title: {
          en: "Member Rewards",
          ar: "مكافآت الأعضاء",
        },

        description: {
          en: "Earn points on every purchase and unlock exclusive drops.",
          ar: "اكسب نقاطًا مع كل عملية شراء واحصل على إصدارات حصرية.",
        },

        icon: "gift",
      },

      {
        id: nanoid(),

        title: {
          en: "Secure Checkout",
          ar: "دفع آمن",
        },

        description: {
          en: "Bank-level encryption keeps your payment data locked down.",
          ar: "تشفير بمستوى أمان البنوك يحافظ على بيانات الدفع الخاصة بك بأمان.",
        },

        icon: "lock",
      },
    ],
  }),
  generalCountdownOffers: () => ({
    badge: {
      en: "Limited time — ends Sunday",
      ar: "لفترة محدودة — ينتهي العرض يوم الأحد",
    },

    titleBefore: {
      en: "Up to",
      ar: "خصم يصل إلى",
    },

    titleHighlight: {
      en: "40% off",
      ar: "40%",
    },

    titleAfter: {
      en: "select styles.",
      ar: "على موديلات مختارة.",
    },

    description: {
      en: "Score last-season's heat at a fraction of the price. Sizes and styles are limited — once they're gone, they're gone.",
      ar: "احصل على موديلات الموسم الماضي بأسعار مخفضة بشكل كبير. المقاسات والموديلات محدودة — بمجرد نفادها لن تتوفر مرة أخرى.",
    },

    primaryButton: {
      text: {
        en: "Shop The Sale",
        ar: "تسوق التخفيضات",
      },
      href: "#sale",
    },

    secondaryButton: {
      text: {
        en: "Use Code: STRYDE40",
        ar: "استخدم الكود: STRYDE40",
      },
    },

    countdown: {
      endDate: (() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(23, 59, 59, 0);

        return tomorrow.toISOString();
      })(),
    },
  }),
  testimonials: () => ({
    heading: {
      en: "Loved by 50,000+",
      ar: "محبوب من أكثر من 50,000 عميل",
    },

    title1: {
      en: "Real Sneakerheads.",
      ar: "عشاق أحذية حقيقيون.",
    },

    title2: {
      en: "Real Reviews.",
      ar: "تقييمات حقيقية.",
    },

    testimonials: [
      {
        id: nanoid(),
        name: {
          en: "Alex Morgan",
          ar: "أليكس مورغان",
        },
        handle: "@alexmorgan",
        avatar: "AM",
        role: {
          en: "Verified Buyer",
          ar: "مشتري موثّق",
        },
        rating: 5,
        text: {
          en: "The shoes arrived exactly as described. Amazing quality and incredibly fast shipping.",
          ar: "وصلت الأحذية تمامًا كما وُصفت. جودة رائعة وشحن سريع بشكل مذهل.",
        },
      },

      {
        id: nanoid(),
        name: {
          en: "James Wilson",
          ar: "جيمس ويلسون",
        },
        handle: "@jameswilson",
        avatar: "JW",
        role: {
          en: "Sneaker Collector",
          ar: "جامع أحذية رياضية",
        },
        rating: 5,
        text: {
          en: "I've bought several pairs from here and every single one has been authentic. Highly recommended.",
          ar: "اشتريت عدة أزواج من هنا، وكل زوج منها كان أصليًا. أنصح بهذا المتجر بشدة.",
        },
      },

      {
        id: nanoid(),
        name: {
          en: "Daniel Smith",
          ar: "دانيال سميث",
        },
        handle: "@danielsmith",
        avatar: "DS",
        role: {
          en: "Verified Buyer",
          ar: "مشتري موثّق",
        },
        rating: 5,
        text: {
          en: "Great selection, great prices, and the checkout process was super easy.",
          ar: "تشكيلة رائعة، وأسعار ممتازة، وعملية الدفع كانت سهلة للغاية.",
        },
      },

      {
        id: nanoid(),
        name: {
          en: "Michael Brown",
          ar: "مايكل براون",
        },
        handle: "@michaelbrown",
        avatar: "MB",
        role: {
          en: "Sneakerhead",
          ar: "عاشق للأحذية الرياضية",
        },
        rating: 4,
        text: {
          en: "Really impressed with the service. My order arrived quickly and the sneakers look perfect.",
          ar: "أعجبتني الخدمة كثيرًا. وصل طلبي بسرعة والأحذية الرياضية تبدو مثالية.",
        },
      },
    ],
  }),
  twoColumnRichText: () => ({
    image: "/images/about-store.jpg",

    imageAlt: {
      en: "Our store",
      ar: "متجرنا",
    },

    imageSide: "left",

    heading: {
      mainTitle: {
        en: "About Our Store",
        ar: "عن متجرنا",
      },

      title1: {
        en: "Built for people who love",
        ar: "صُمم للأشخاص الذين يحبون",
      },

      title2: {
        en: "great products.",
        ar: "المنتجات الرائعة.",
      },
    },

    content: {
      en: `
      <h2>Built for people who love great products.</h2>

      <p>
        Discover carefully selected products designed to make
        your everyday life better.
      </p>

      <p>
        We believe great shopping should be simple, enjoyable,
        and trustworthy.
      </p>

      <ul>
        <li>Premium quality products</li>
        <li>Fast and reliable shipping</li>
        <li>Secure checkout</li>
      </ul>
    `,

      ar: `
      <h2>صُمم للأشخاص الذين يحبون المنتجات الرائعة.</h2>

      <p>
        اكتشف مجموعة مختارة بعناية من المنتجات المصممة
        لتجعل حياتك اليومية أفضل.
      </p>

      <p>
        نؤمن بأن تجربة التسوق الرائعة يجب أن تكون بسيطة،
        وممتعة، وموثوقة.
      </p>

      <ul>
        <li>منتجات عالية الجودة</li>
        <li>شحن سريع وموثوق</li>
        <li>دفع آمن</li>
      </ul>
    `,
    },
  }),
};

/* ------------------------------------------------------------------ */
/* Provider */
/* ------------------------------------------------------------------ */

export function CMSProvider({ children }: CMSProviderProps) {
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();
  const [updatePage, { isLoading }] = useUpdatePageMutation();

  const { data } = useGetPageQuery(undefined);

  const { data: pagesLinks } = useGetPageLinksQuery(undefined);

  const [pages, setPages] = useState<Pages>([]);

  const [pageLinks, setpageLinks] = useState<LinkType[]>([]);

  const [currentPage, setcurrentPage] = useState<string>("");

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [showAdd, setShowAdd] = useState<boolean>(false);

  /* ------------------------------------------------------------------ */
  /* History */
  /* ------------------------------------------------------------------ */

  const [history, setHistory] = useState<Pages[]>([]);

  const [redoStack, setRedoStack] = useState<Pages[]>([]);

  /* ------------------------------------------------------------------ */
  /* Memoized Data */
  /* ------------------------------------------------------------------ */

  const currentPageData = useMemo(() => {
    return pages.find((page) => page.id == currentPage) || null;
  }, [pages, currentPage]);

  const selectedSection = useMemo(() => {
    if (!currentPageData) return null;

    return (
      currentPageData.sections.find((section) => section.id === selectedId) ||
      null
    );
  }, [currentPageData, selectedId]);

  /* ------------------------------------------------------------------ */
  /* Effects */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    if (data) {
      setPages(data);
    }
  }, [data]);

  useEffect(() => {
    if (pagesLinks) {
      setpageLinks(pagesLinks);
    }
  }, [pagesLinks]);

  /* ------------------------------------------------------------------ */
  /* Helpers */
  /* ------------------------------------------------------------------ */

  const saveHistory = useCallback(
    (newPages: Pages) => {
      setHistory((prev) => [...prev, pages]);

      setRedoStack([]);

      setPages(newPages);
    },
    [pages],
  );

  const updateCurrentPage = useCallback(
    (callback: (page: Page) => Page) => {
      const newPages = pages.map((page) => {
        if (page.id !== currentPage) {
          return page;
        }

        return callback(page);
      });

      saveHistory(newPages);
    },
    [pages, currentPage, saveHistory],
  );

  /* ------------------------------------------------------------------ */
  /* Actions */
  /* ------------------------------------------------------------------ */

  const undo = useCallback(() => {
    if (!history.length) return;

    const prev = history[history.length - 1];

    setHistory((h) => h.slice(0, h.length - 1));

    setRedoStack((r) => [...r, pages]);

    setPages(prev);
  }, [history, pages]);

  const redo = useCallback(() => {
    if (!redoStack.length) return;

    const next = redoStack[redoStack.length - 1];

    setRedoStack((r) => r.slice(0, r.length - 1));

    setHistory((h) => [...h, pages]);

    setPages(next);
  }, [redoStack, pages]);

  const updateProp = useCallback(
    (
      id: string,
      prop: string,
      value: unknown | ((prev: unknown) => unknown),
    ) => {
      updateCurrentPage((page) => ({
        ...page,

        sections: page.sections.map((section) => {
          if (section.id !== id) {
            return section;
          }

          const prevValue = section.props[prop as keyof typeof section.props];

          return {
            ...section,

            props: {
              ...section.props,

              [prop]: typeof value === "function" ? value(prevValue) : value,
            },
          };
        }),
      }));
    },
    [updateCurrentPage],
  );

  const updatePageProp = useCallback(
    (prop: keyof Page, value: unknown) => {
      updateCurrentPage((page) => ({
        ...page,
        [prop]: value,
      }));
    },
    [updateCurrentPage],
  );

  const updatePageTranslation = useCallback(
    (prop: keyof Page, locale: "en" | "ar", value: string) => {
      updateCurrentPage((page) => {
        const currentValue = page[prop];

        const translations =
          typeof currentValue === "object" && currentValue !== null
            ? currentValue
            : {
                en: typeof currentValue === "string" ? currentValue : "",
                ar: "",
              };

        return {
          ...page,
          [prop]: {
            ...translations,
            [locale]: value,
          },
        };
      });
    },
    [updateCurrentPage],
  );

  const deleteSection = useCallback(
    (id: string) => {
      updateCurrentPage((page) => ({
        ...page,

        sections: page.sections.filter((section) => section.id !== id),
      }));

      setSelectedId(null);
    },
    [updateCurrentPage],
  );

  const moveSection = useCallback(
    (from: number, to: number) => {
      updateCurrentPage((page) => {
        const sections = [...page.sections];

        const [removed] = sections.splice(from, 1);

        sections.splice(to, 0, removed);

        return {
          ...page,
          sections,
        };
      });
    },
    [updateCurrentPage],
  );

  const addSection = useCallback(
    (index: number, type: SectionType) => {
      const newSection: Section = {
        id: nanoid(),
        type,
        props: SECTION_DEFAULTS[type](),
      };

      updateCurrentPage((page) => {
        const sections = [...page.sections];

        sections.splice(index + 1, 0, newSection);

        return {
          ...page,
          sections,
        };
      });
      setSelectedId(newSection.id);
      return newSection.id;
    },
    [updateCurrentPage, setSelectedId],
  );

  const createPage = useCallback(() => {
    const id = nanoid();

    const page: Page = {
      id,

      title: { en: "Unknown", ar: "بدون عنوان" },

      slug: "unknown",

      sections: [
        {
          id: nanoid(),

          type: "hero",

          props: SECTION_DEFAULTS.hero(),
        },
      ],
    };

    setPages((prev) => [...prev, page]);

    setcurrentPage(id);

    return page;
  }, []);

  const saveToBackend = useCallback(async () => {
    if (!currentPageData) return;

    try {
      const { data } = await updatePage({
        id: currentPageData.id,
        data: {
          title: currentPageData.title,

          sections: currentPageData.sections,
        },
      });
      dispatch(pageApi.util.invalidateTags(["pagesLinks"]));
      updatePageProp("id", data.id);
      setcurrentPage(data.id);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
      }, 1200);
    } catch (error) {
      console.error(error);

      setSuccess(false);
    }
  }, [currentPageData, updatePage]);

  /* ------------------------------------------------------------------ */
  /* Context Value */
  /* ------------------------------------------------------------------ */

  const value = useMemo(
    () => ({
      pages,
      setPages,

      currentPage,
      setcurrentPage,

      currentPageData,

      createPage,

      pageLinks,
      setpageLinks,

      updatePageProp,
      updatePageTranslation,
      selectedId,
      setSelectedId,

      selectedSection,

      updateProp,

      deleteSection,

      moveSection,

      addSection,
      showAdd,
      setShowAdd,
      undo,
      redo,

      saveToBackend,

      isLoading,
      success,
    }),
    [
      pages,
      currentPage,
      currentPageData,
      createPage,
      pageLinks,
      updatePageProp,
      updatePageTranslation,
      selectedId,
      selectedSection,
      updateProp,
      deleteSection,
      moveSection,
      addSection,
      showAdd,
      setShowAdd,
      undo,
      redo,
      saveToBackend,
      isLoading,
      success,
    ],
  );

  return <CMSContext.Provider value={value}>{children}</CMSContext.Provider>;
}

/* ------------------------------------------------------------------ */
/* Hook */
/* ------------------------------------------------------------------ */

export const useCMS = () => {
  const ctx = useContext(CMSContext);

  if (!ctx) {
    throw new Error("useCMS must be used inside CMSProvider");
  }

  return ctx;
};
