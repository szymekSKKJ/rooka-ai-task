import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { ListItem } from "../../api/getListData";
import { ChevronUpIcon, XMarkIcon } from "../icons";

type CardProps = {
  title: ListItem["title"];
  description?: ListItem["description"];
  id: ListItem["id"];
  setCards: Dispatch<SetStateAction<ListItem[]>>;
};

const Card = ({ title, description, id, setCards }: CardProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [cardElementProperties, setCardElementProperties] = useState<null | {
    collapsedHeight: number;
    expandedHeight: number;
  }>({ collapsedHeight: 0, expandedHeight: 0 });

  const cardElementRef = useRef<null | HTMLDivElement>(null);
  const titleElementRef = useRef<null | HTMLHeadingElement>(null);

  // You may wonder why I did this stuff for simple animation. The trick with "max-height" wokrs but its ugly. It once runs faster once slower depends on end height of element
  // In this scenaria we always get the exact height so the animation always be this same

  useEffect(() => {
    const resize = () => {
      if (cardElementRef.current !== null && titleElementRef.current !== null) {
        const { paddingTop } = getComputedStyle(cardElementRef.current);

        setCardElementProperties({
          collapsedHeight: titleElementRef.current.scrollHeight + 2 * parseInt(paddingTop.split("px")[0]),
          expandedHeight: cardElementRef.current.scrollHeight,
        });
      }
    };

    resize();

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      className="border border-black px-2 py-1.5 overflow-hidden transition-height duration-150 cursor-pointer"
      ref={cardElementRef}
      style={{ height: isCollapsed ? `${cardElementProperties?.collapsedHeight}px` : `${cardElementProperties?.expandedHeight}px` }}
      onClick={() => {
        if (description !== undefined) {
          setIsCollapsed((currentValue) => {
            if (currentValue === true) {
              return false;
            } else {
              return true;
            }
          });
        }
      }}>
      <div className="flex justify-between">
        <h1 className="font-medium leading-normal" ref={titleElementRef}>
          {title}
        </h1>
        {description && (
          <>
            <div className="flex">
              <button className={`transition-all duration-300  hover:text-gray-700  flex items-center justify-center 0 ${isCollapsed ? "" : "rotate-180"}`}>
                <ChevronUpIcon />
              </button>
              <button
                className="hover:text-gray-700 transition-colors flex items-center justify-center"
                onClick={(event) => {
                  event.stopPropagation();

                  setCards((currentValue) => {
                    const copiedCurrentValue = [...currentValue];

                    const foundElement = copiedCurrentValue.find((data) => data.id === id);

                    if (foundElement) {
                      foundElement.isVisible = false;
                    }

                    return copiedCurrentValue;
                  });
                }}>
                <XMarkIcon />
              </button>
            </div>
          </>
        )}
      </div>
      {description && <p className="text-sm mt-1">{description}</p>}
    </div>
  );
};

export { Card };
