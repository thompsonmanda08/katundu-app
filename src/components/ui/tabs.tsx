import { cn } from "@/lib/utils";
import { Button } from "./button";
import SelectField from "./select";
import { OptionItem } from "@/lib/types";

type TabsProps = {
  tabs: OptionItem[];
  navigateTo: (tab: number) => void;
  currentTab: number;
  className?: string;
  classNames?: {
    innerWrapper?: string;
    button?: string;
    nav?: string;
    icon?: string;
  };
  Icon?: React.ReactNode;
};

function Tabs({
  tabs,
  navigateTo,
  currentTab,
  className,
  classNames,
  Icon,
}: TabsProps) {
  const { innerWrapper, button, nav, icon } = classNames || {};

  return (
    <div className={cn("w-full sm:w-auto", className)}>
      <div className="w-full sm:hidden sm:w-auto">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>

        <SelectField
          name="tabs"
          options={tabs as OptionItem[]}
          className=" h-auto w-full"
          placeholder={"Select a tab"}
          value={tabs[currentTab]?.id.toString()}
          onChange={(selected) => navigateTo(parseInt(selected))}
        />
      </div>
      <div className={cn("hidden sm:block", innerWrapper)}>
        <nav
          className={cn(
            "min-w-md -mb-px flex gap-x-4 rounded-lg dark:bg-primary/5 bg-primary/10 max-w-fit p-1",
            nav
          )}
          aria-label="Tabs"
        >
          {tabs.map((tab, index) => (
            <Button
              key={index}
              type="button"
              onClick={() => navigateTo(index)}
              className={cn(
                "whitespace-nowrap border-transparent text-sm text-foreground-600 bg-transparent hover:bg-primary/10 px-5",
                {
                  "border-primary border-b dark:border-primary dark:bg-primary/5 bg-background dark:text-primary-400 text-primary shadow-sm":
                    index == currentTab,
                },
                button
              )}
              aria-current={index == currentTab ? "true" : undefined}
            >
              {tab?.icon && (
                <tab.icon
                  className={cn(
                    "h-5 w-5 mr-2",
                    {
                      "text-primary ": tab?.id == currentTab,
                    },
                    icon
                  )}
                />
              )}
              {tab?.name || tab?.title || tab?.label}
            </Button>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default Tabs;
