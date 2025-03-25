import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// needs to store legalName, email, contributorType, and split %
interface PageData {
  legalName: string;
  email: string;
  contributorType: string;//songwriting contribution
  masterContributorType: string;//master recording contribution
  split: number;
  splitTotal: number;
  aka:string;
  ipi:string;
  address:string;
  id:string;
  producer:string;
}

// storing over dynamic pages dynamic pages
interface DynamicPageState {
  pages: { [id: number]: PageData }; // data is keyed by page id
  setPageData: (id: number, data: Partial<PageData>) => void; // Action to update data for a specific page
  resetPages: (startFromPage: number) => void;
}

const useDynamicPageStore = create<DynamicPageState>()(
  persist(
    (set) => ({
      pages: {}, // Initial state: an empty object to store page data
      setPageData: (id, data) =>
        set((state) => ({
          pages: {
            ...state.pages,
            [id]: { ...state.pages[id], ...data },
          },
        })),
      // Function to reset pages starting from a specific page
      resetPages: (startFromPage) =>
        set((state) => {
          const updatedPages = { ...state.pages };

          Object.keys(updatedPages).forEach((key) => {
            const pageId = parseInt(key);
            if (pageId >= startFromPage) {
              updatedPages[pageId] = {
                legalName: "",
                email: "",
                contributorType: "",
                masterContributorType: "",
                split: 0,
                splitTotal: 0,
                aka:"",
                ipi:"",
                address:"",
                id:"",
                producer:"",
              };
            }
          });
          return { pages: updatedPages };
        }),
    }),
    {
      name: 'dynamic-pages-storage', 
      partialize: (state) => ({
        pages: Object.fromEntries(
          Object.entries(state.pages).map(([key, page]) => [
            key,
            {
              legalName: page.legalName,
              email: page.email,
              contributorType: page.contributorType,
              masterContributorType: page.masterContributorType,
              split: page.split,
              splitTotal: page.splitTotal,
              aka: page.aka,
              ipi: page.ipi,
              address: page.address,
              id: page.id,
              producer: page.producer,
            }
          ])
        )
      }),    }
  )
);

export default useDynamicPageStore;
