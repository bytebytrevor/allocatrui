import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  BriefcaseBusinessIcon,
  CoffeeIcon,
  HandIcon,
  HeartIcon,
  LayoutGridIcon,
  LeafIcon,
  SearchIcon,
  SmileIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { menuSurface, quietAction } from "./workspace-ui";

type Group = "faces" | "gestures" | "hearts" | "work" | "nature" | "food";
type Entry = { emoji: string; name: string; search: string; group: Group };
const groups = [
  { id: "all", name: "All emojis", icon: LayoutGridIcon },
  { id: "faces", name: "Smileys", icon: SmileIcon },
  { id: "gestures", name: "People and gestures", icon: HandIcon },
  { id: "hearts", name: "Hearts and celebrations", icon: HeartIcon },
  { id: "work", name: "Work and symbols", icon: BriefcaseBusinessIcon },
  { id: "nature", name: "Nature", icon: LeafIcon },
  { id: "food", name: "Food and drink", icon: CoffeeIcon },
] as const;
const data: Record<Group, [string, string, string][]> = {
  faces: [
    ["😀", "Grinning face", "happy smile hello"],
    ["😃", "Big smile", "happy cheerful excited"],
    ["😄", "Smiling eyes", "happy smile laugh"],
    ["😁", "Beaming face", "grin happy teeth"],
    ["😆", "Laughing face", "laugh happy"],
    ["😅", "Smiling with sweat", "relief awkward nervous"],
    ["😂", "Tears of joy", "laugh funny lol"],
    ["🤣", "Rolling with laughter", "laugh funny lol"],
    ["🙂", "Slight smile", "happy friendly"],
    ["🙃", "Upside-down face", "ironic playful"],
    ["😉", "Winking face", "wink joke"],
    ["😊", "Blushing smile", "happy thanks shy"],
    ["🥰", "Face with hearts", "love appreciation"],
    ["😍", "Heart eyes", "love like"],
    ["🤩", "Star eyes", "amazing impressed"],
    ["😎", "Sunglasses face", "cool confident"],
    ["🤓", "Nerd face", "study smart"],
    ["🤔", "Thinking face", "think question consider"],
    ["🧐", "Face with monocle", "review inspect"],
    ["🤗", "Hugging face", "hug welcome thanks"],
    ["🤭", "Hand over mouth", "surprise giggle"],
    ["🤫", "Shushing face", "quiet secret"],
    ["😴", "Sleeping face", "sleep tired"],
    ["😌", "Relieved face", "calm relief"],
    ["😬", "Grimacing face", "awkward nervous"],
    ["😮", "Surprised face", "wow surprise"],
    ["😢", "Crying face", "sad tear"],
    ["😭", "Loudly crying face", "sad tears"],
    ["😕", "Confused face", "confused unsure"],
    ["😟", "Worried face", "concern worried"],
    ["😤", "Face with steam", "frustrated determination"],
    ["😠", "Angry face", "angry upset"],
    ["🥳", "Partying face", "celebrate birthday party"],
    ["🥹", "Holding back tears", "touched grateful"],
    ["🫡", "Saluting face", "understood respect yes"],
  ],
  gestures: [
    ["🤝", "Handshake", "agreement partner deal"],
    ["👍", "Thumbs up", "yes agree approve good done"],
    ["👎", "Thumbs down", "no disagree"],
    ["👌", "OK hand", "okay perfect"],
    ["🤌", "Pinched fingers", "gesture"],
    ["✌️", "Victory hand", "peace success"],
    ["🤞", "Crossed fingers", "hope luck"],
    ["🤟", "Love-you gesture", "love"],
    ["🤘", "Rock on", "music rock"],
    ["👋", "Waving hand", "hello goodbye hi"],
    ["👏", "Clapping hands", "congratulations applause well done"],
    ["🙌", "Raised hands", "celebrate hooray"],
    ["👐", "Open hands", "welcome"],
    ["🤲", "Palms up", "support receive"],
    ["🙏", "Folded hands", "please thanks thank you pray"],
    ["💪", "Flexed arm", "strong strength effort"],
    ["👊", "Fist bump", "team teamwork"],
    ["✍️", "Writing hand", "write note"],
    ["👀", "Eyes", "look review watching"],
    ["👤", "Person silhouette", "person individual"],
    ["👥", "People silhouettes", "team group people"],
    ["🧑‍💻", "Person at computer", "developer coding work"],
    ["🧑‍🎨", "Artist", "creative design art"],
    ["🧑‍💼", "Office worker", "business professional"],
    ["🧑‍🔧", "Mechanic", "repair maintenance"],
  ],
  hearts: [
    ["❤️", "Red heart", "love care"],
    ["🧡", "Orange heart", "love care"],
    ["💛", "Yellow heart", "love friendship"],
    ["💚", "Green heart", "love care"],
    ["💙", "Blue heart", "love trust"],
    ["💜", "Purple heart", "love care"],
    ["🤍", "White heart", "love peace"],
    ["🖤", "Black heart", "love"],
    ["🤎", "Brown heart", "love care"],
    ["💕", "Two hearts", "love friendship"],
    ["💖", "Sparkling heart", "love thanks"],
    ["💝", "Heart with ribbon", "gift love"],
    ["🎉", "Party popper", "celebration congratulations success"],
    ["🎊", "Confetti ball", "celebration congratulations"],
    ["🎈", "Balloon", "party birthday"],
    ["🎁", "Wrapped gift", "gift birthday thanks"],
    ["🎂", "Birthday cake", "birthday celebrate"],
    ["🏆", "Trophy", "winner achievement award"],
    ["🥇", "Gold medal", "first winner achievement"],
    ["🏅", "Medal", "award recognition"],
    ["🌟", "Glowing star", "excellent great"],
    ["✨", "Sparkles", "new amazing polished"],
    ["🔥", "Fire", "great hot excellent"],
    ["💯", "Hundred points", "perfect agree excellent"],
  ],
  work: [
    ["✅", "Check mark", "done complete approved yes"],
    ["☑️", "Checked box", "done checklist"],
    ["✔️", "Tick", "done correct"],
    ["❌", "Cross mark", "no incorrect cancel"],
    ["⚠️", "Warning", "attention issue alert"],
    ["❗", "Exclamation mark", "important urgent"],
    ["❓", "Question mark", "question help"],
    ["💡", "Light bulb", "idea suggestion"],
    ["📌", "Pushpin", "pin important"],
    ["📎", "Paperclip", "attachment file"],
    ["📁", "Folder", "files project"],
    ["📄", "Document", "file page report"],
    ["📝", "Memo", "notes write"],
    ["📋", "Clipboard", "tasks checklist"],
    ["📅", "Calendar", "schedule date meeting"],
    ["⏰", "Alarm clock", "deadline reminder time"],
    ["⏳", "Hourglass", "waiting pending time"],
    ["⌛", "Finished hourglass", "time deadline"],
    ["🚀", "Rocket", "launch start progress"],
    ["🎯", "Target", "goal focus objective"],
    ["📊", "Bar chart", "report analytics progress"],
    ["📈", "Increasing chart", "growth progress"],
    ["💬", "Speech bubble", "message discussion"],
    ["📣", "Megaphone", "announcement update"],
    ["🔔", "Bell", "notification reminder"],
    ["🔒", "Lock", "private secure"],
    ["🔑", "Key", "access solution"],
    ["⚙️", "Gear", "settings process"],
    ["🛠️", "Tools", "fix work maintenance"],
    ["💻", "Laptop", "computer work"],
    ["🔍", "Magnifying glass", "search review inspect"],
    ["🧩", "Puzzle piece", "solution integration"],
    ["💼", "Briefcase", "business work"],
    ["🔄", "Refresh arrows", "update repeat retry"],
    ["➡️", "Right arrow", "next forward"],
    ["⬆️", "Up arrow", "up increase"],
  ],
  nature: [
    ["☀️", "Sun", "sunny weather day"],
    ["🌤️", "Sun behind cloud", "weather"],
    ["🌈", "Rainbow", "hope colour weather"],
    ["🌧️", "Rain cloud", "rain weather"],
    ["⛈️", "Thunderstorm", "storm weather"],
    ["❄️", "Snowflake", "cold snow"],
    ["🌙", "Crescent moon", "night evening"],
    ["⭐", "Star", "favourite favorite"],
    ["🌍", "Globe Africa", "world earth global"],
    ["🌱", "Seedling", "grow start environment"],
    ["🌿", "Herb", "plant nature green"],
    ["🍀", "Four-leaf clover", "luck nature"],
    ["🌻", "Sunflower", "flower thanks"],
    ["🌸", "Cherry blossom", "flower spring"],
    ["🌹", "Rose", "flower love"],
    ["🌳", "Tree", "nature environment"],
    ["🌊", "Wave", "water sea"],
    ["🦋", "Butterfly", "nature change"],
  ],
  food: [
    ["☕", "Hot drink", "coffee tea break"],
    ["🍵", "Teacup", "tea green tea"],
    ["🫖", "Teapot", "tea break"],
    ["🥤", "Cup with straw", "drink refreshment"],
    ["💧", "Water drop", "water drink"],
    ["🍎", "Red apple", "fruit food"],
    ["🍊", "Orange", "fruit food"],
    ["🍌", "Banana", "fruit food"],
    ["🍇", "Grapes", "fruit food"],
    ["🍉", "Watermelon", "fruit food"],
    ["🍕", "Pizza", "food lunch"],
    ["🍔", "Burger", "food lunch"],
    ["🥪", "Sandwich", "food lunch break"],
    ["🥗", "Salad", "food lunch healthy"],
    ["🍿", "Popcorn", "snack movie"],
    ["🍪", "Cookie", "snack biscuit"],
    ["🍫", "Chocolate", "snack thanks"],
    ["🍩", "Doughnut", "snack donut"],
  ],
};
const entries: Entry[] = (Object.keys(data) as Group[]).flatMap((group) =>
  data[group].map(([emoji, name, search]) => ({ emoji, name, search, group })),
);

export default function EmojiPicker({
  disabled,
  onChoose,
  onRestoreFocus,
}: {
  disabled?: boolean;
  onChoose: (emoji: string) => boolean;
  onRestoreFocus: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<string>("all");
  const input = useRef<HTMLInputElement>(null);
  const results = useRef<HTMLDivElement>(null);
  const categories = useRef<HTMLDivElement>(null);
  const restore = useRef(false);
  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }
    const frame = requestAnimationFrame(() => input.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);
  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);
  const term = query.trim().toLowerCase();
  const matches = entries.filter((item) =>
    term
      ? `${item.emoji} ${item.name} ${item.search}`.toLowerCase().includes(term)
      : group === "all" || item.group === group,
  );
  function move(event: KeyboardEvent<HTMLDivElement>) {
    const items = Array.from(
      results.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [],
    );
    const index = items.indexOf(document.activeElement as HTMLElement);
    if (index < 0) return;
    let next = index;
    if (event.key === "ArrowLeft") next--;
    else if (event.key === "ArrowRight") next++;
    else if (event.key === "ArrowDown") next += 7;
    else if (event.key === "ArrowUp") {
      if (index < 7) {
        event.preventDefault();
        event.stopPropagation();
        (
          categories.current?.querySelector<HTMLElement>(
            '[aria-checked="true"]',
          ) ?? input.current
        )?.focus();
        return;
      }
      next -= 7;
    } else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = items.length - 1;
    else return;
    event.preventDefault();
    event.stopPropagation();
    items[Math.max(0, Math.min(items.length - 1, next))]?.focus();
  }
  return (
    <DropdownMenu
      modal={false}
      open={open}
      onOpenChange={(value) => {
        if (!disabled || !value) setOpen(value);
      }}
    >
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-label="Insert emoji"
          title="Insert emoji"
          className={`${quietAction} h-9 min-h-9 w-9 px-0`}
        >
          <SmileIcon size={16} aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="top"
        sideOffset={8}
        collisionPadding={12}
        className={`${menuSurface} w-[320px] max-w-[calc(100vw-24px)] max-h-[var(--radix-dropdown-menu-content-available-height)] overflow-y-auto p-2`}
        onCloseAutoFocus={(event) => {
          if (restore.current) {
            event.preventDefault();
            restore.current = false;
            onRestoreFocus();
          }
        }}
      >
        <p className="px-1 pb-2 pt-1 text-[11px] font-medium text-foreground">
          Choose an emoji
        </p>
        <div className="relative">
          <SearchIcon
            size={13}
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            ref={input}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            maxLength={60}
            placeholder="Search emojis"
            aria-label="Search emojis"
            className="h-10 w-full rounded-lg border border-input bg-surface-2 pl-9 pr-3 text-base text-foreground outline-none placeholder:text-muted-foreground/70 focus-visible:border-ring/50 sm:text-xs"
            onKeyDown={(event) => {
              if (event.key === "Escape") return;
              if (event.key === "ArrowDown") {
                event.preventDefault();
                (
                  results.current?.querySelector<HTMLElement>(
                    '[role="menuitem"]',
                  ) ??
                  categories.current?.querySelector<HTMLElement>(
                    '[aria-checked="true"]',
                  )
                )?.focus();
              }
              if (event.key === "Enter") event.preventDefault();
              event.stopPropagation();
            }}
          />
        </div>
        <div
          ref={categories}
          role="group"
          aria-label="Emoji categories"
          className="my-2 grid grid-cols-7 gap-1 border-b border-border/65 pb-2"
          onKeyDown={(event) => {
            if (event.key === "ArrowUp") {
              event.preventDefault();
              event.stopPropagation();
              input.current?.focus();
            }
            if (event.key === "ArrowDown") {
              event.preventDefault();
              event.stopPropagation();
              results.current
                ?.querySelector<HTMLElement>('[role="menuitem"]')
                ?.focus();
            }
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
              const nodes = Array.from(
                categories.current?.querySelectorAll<HTMLElement>(
                  '[role="menuitemradio"]',
                ) ?? [],
              );
              const index = nodes.indexOf(
                document.activeElement as HTMLElement,
              );
              event.preventDefault();
              event.stopPropagation();
              nodes[
                (index + (event.key === "ArrowRight" ? 1 : nodes.length - 1)) %
                  nodes.length
              ]?.focus();
            }
          }}
        >
          {groups.map(({ id, name, icon: Icon }) => (
            <DropdownMenuItem
              key={id}
              role="menuitemradio"
              aria-checked={!term && group === id}
              aria-label={name}
              title={name}
              className={`flex min-h-9 cursor-pointer items-center justify-center rounded-md p-0 focus:bg-surface-3/70 ${!term && group === id ? "bg-surface-2 text-brand-secondary-highlight dark:text-secondary" : "text-muted-foreground"}`}
              onSelect={(event) => {
                event.preventDefault();
                setGroup(id);
                setQuery("");
              }}
            >
              <Icon size={15} aria-hidden="true" />
            </DropdownMenuItem>
          ))}
        </div>
        <div
          ref={results}
          role="group"
          aria-label={
            term
              ? "Emoji search results"
              : groups.find((item) => item.id === group)?.name
          }
          className="grid max-h-[min(224px,35dvh)] grid-cols-7 gap-1 overflow-y-auto overscroll-contain"
          onKeyDown={move}
        >
          {matches.map((item) => (
            <DropdownMenuItem
              key={item.emoji}
              aria-label={item.name}
              title={item.name}
              className="flex min-h-9 cursor-pointer items-center justify-center rounded-md p-0 text-[22px] leading-none focus:bg-surface-3/70"
              onSelect={(event) => {
                event.preventDefault();
                if (disabled) return;
                if (onChoose(item.emoji)) {
                  restore.current = true;
                  setOpen(false);
                }
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  fontFamily:
                    '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif',
                }}
              >
                {item.emoji}
              </span>
            </DropdownMenuItem>
          ))}
        </div>
        {matches.length === 0 && (
          <p
            role="status"
            className="px-2 py-7 text-center text-xs text-muted-foreground"
          >
            No matching emojis. Try another word.
          </p>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
