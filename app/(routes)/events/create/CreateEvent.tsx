"use client";

import StaticDropdown from "@/components/base/Dropdown/StaticDropdown";
import DatePicker from "@/components/base/DatePicker";
import TextArea from "@/components/base/TextArea";
import TextInput from "@/components/base/TextInput";
import TimePicker from "@/components/base/TimePicker";
import { IEvent } from "@/shared/types/event.types";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

const EventDetailItem = ({
  icon,
  alt,
  label,
}: {
  icon: string;
  alt: string;
  label: string;
}) => (
  <div className="flex-row-gap-2 items-center">
    <Image src={icon} alt={alt} width={17} height={17} />
    <p>{label}</p>
  </div>
);

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
  <div className="agenda">
    <h2>Agenda</h2>
    <ul>
      {agendaItems?.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
);

const EventTags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-row gap-1.5 flex-wrap">
    {tags?.map((tag) => (
      <div className="pill" key={tag}>
        {tag}
      </div>
    ))}
  </div>
);

const CreateEvent = () => {
  const [formValues, setFormValues] = useState<IEvent>({
    agenda: [] as string[],
    tags: [] as string[],
    audience: "",
    date: "",
    description: "",
    location: "",
    title: "",
    time: "",
    slug: "",
    mode: "",
    venue: "",
    organizer: "",
    overview: "",
  } as IEvent);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [agendaInput, setAgendaInput] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    // Append all form values to FormData
    Object.keys(formValues).forEach((key) => {
      const value = formValues[key as keyof IEvent];

      formData.append(key, value as string);
    });

    // Append the image file if present
    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/events`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      toast.success(data.msg);
    } catch (error) {
      console.log(error);
      toast.error("Error in Creating Event!");
    }
  };

  const changeHandler = (name: string, value: any) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const addListItem = (name: "agenda" | "tags", value: string) => {
    const nextValue = value.trim();
    if (!nextValue) return;
    const currentList = formValues[name] ?? [];
    if (currentList.includes(nextValue)) return;
    setFormValues({ ...formValues, [name]: [...currentList, nextValue] });
  };

  const removeListItem = (name: "agenda" | "tags", value: string) => {
    const currentList = formValues[name] ?? [];
    setFormValues({
      ...formValues,
      [name]: currentList.filter((item) => item !== value),
    });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  useEffect(() => {
    if (!image) {
      setImagePreviewUrl("");
      return;
    }
    const objectUrl = URL.createObjectURL(image);
    setImagePreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const previewTitle = formValues.title || "Your Event Title";
  const previewDescription =
    formValues.description ||
    "Add a short description to show how your event will feel to attendees.";
  const previewOverview =
    formValues.overview ||
    "Share the main purpose, highlights, and what attendees can expect.";
  const previewAgenda =
    formValues.agenda?.length > 0
      ? formValues.agenda
      : ["Welcome remarks", "Keynote session", "Networking"];
  const previewTags =
    formValues.tags?.length > 0
      ? formValues.tags
      : ["Community", "Tech", "Networking"];
  const previewMode = formValues.mode
    ? formValues.mode[0].toUpperCase() + formValues.mode.slice(1)
    : "Event Mode";
  const previewImageSrc = imagePreviewUrl || "/images/placeholder.svg";

  return (
    <section id="event" className="w-full">
      <div className="header">
        <h1>Create New Event</h1>
        <p>
          Preview your event as you build it so it feels real from the start.
        </p>
      </div>
      <div className="details">
        <div className="content">
          <Image
            width={600}
            height={400}
            src={previewImageSrc}
            alt="Event banner preview"
            className="banner"
          />
          <section className="flex-col-gap-2">
            <h2>{previewTitle}</h2>
            <p>{previewDescription}</p>
          </section>
          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{previewOverview}</p>
          </section>
          <section className="flex-col-gap-2">
            <h2>Event Details</h2>
            <EventDetailItem
              icon="/icons/calendar.svg"
              alt="calendar"
              label={formValues.date || "Event Date"}
            />
            <EventDetailItem
              icon="/icons/clock.svg"
              alt="clock"
              label={formValues.time || "Event Time"}
            />
            <EventDetailItem
              icon="/icons/pin.svg"
              alt="pin"
              label={formValues.location || "Event Location"}
            />
            <EventDetailItem
              icon="/icons/mode.svg"
              alt="mode"
              label={previewMode}
            />
            <EventDetailItem
              icon="/icons/audience.svg"
              alt="audience"
              label={formValues.audience || "Target Audience"}
            />
          </section>
          <EventAgenda agendaItems={previewAgenda} />
          <section className="flex-col-gap-2">
            <h2>About the Organizer</h2>
            <p>{formValues.organizer || "Tell attendees who is hosting."}</p>
          </section>
          <EventTags tags={previewTags} />
        </div>

        <aside className="booking">
          <div className="signup-card">
            <h2>Event Builder</h2>
            <p className="text-sm text-light-100">
              Fill in the details and watch the preview update instantly.
            </p>
            <form onSubmit={handleSubmit} className="w-full space-y-5">
              <TextInput
                name="title"
                placeholder="Event Title"
                value={formValues.title}
                onChange={changeHandler}
                label="Title"
              />
              <TextInput
                name="slug"
                label="Slug"
                placeholder="Event Slug"
                value={formValues.slug}
                onChange={changeHandler}
              />

              <DatePicker
                name="date"
                label="Date"
                value={formValues.date}
                onChange={changeHandler}
              />
              <TimePicker
                label="Time"
                name="time"
                value={formValues.time}
                onChange={changeHandler}
              />
              <label className="relative flex items-center justify-center hover:bg-dark-300 text-white cursor-pointer w-full bg-dark-200 rounded-[6px] px-5 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary">
                <div className="image-input text-sm text-gray-400 flex flex-row! justify-start items-center gap-2">
                  <p className="image-input__name">
                    {image ? image.name : "Upload event image or banner"}
                  </p>
                  {image ? (
                    <Image
                      src="/icons/delete.svg"
                      alt="delete"
                      width={16}
                      height={16}
                      onClick={() => setImage(null)}
                    />
                  ) : (
                    <></>
                  )}
                </div>
                {!image ? (
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept=".png,.jpg,.jpeg"
                    onChange={handleImageChange}
                  />
                ) : (
                  <></>
                )}
              </label>
              <TextInput
                label="Venue"
                name="venue"
                placeholder="Venue"
                value={formValues.venue}
                onChange={changeHandler}
              />
              <TextInput
                label="Location"
                name="location"
                placeholder="Location"
                value={formValues.location}
                onChange={changeHandler}
              />

              <StaticDropdown
                options={[
                  { label: "Online", value: "online" },
                  { label: "Offline", value: "offline" },
                  { label: "Hybrid", value: "hybrid" },
                ]}
                name="mode"
                label="Event Mode"
                value={formValues.mode}
                onChange={changeHandler}
              />
              <TextInput
                name="audience"
                placeholder="Target Audience"
                value={formValues.audience}
                onChange={changeHandler}
                label="Audience"
              />
              <TextInput
                name="organizer"
                placeholder="Organizer"
                value={formValues.organizer}
                onChange={changeHandler}
                label="Organizer"
              />
              <TextArea
                name="description"
                placeholder="Event Description"
                value={formValues.description}
                onChange={changeHandler}
                label="Description"
              />
              <TextArea
                name="overview"
                placeholder="Event Overview"
                value={formValues.overview}
                onChange={changeHandler}
                label="Overview"
              />
              <div className="relative w-full">
                <p className="absolute -top-3 left-2 bg-dark-200 rounded px-2">
                  Agenda
                </p>
                <input
                  className="bg-dark-200 rounded-[6px] px-5 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary h-12 w-full"
                  name="agenda"
                  placeholder="Type an agenda item and press Enter"
                  value={agendaInput}
                  onChange={(e) => setAgendaInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addListItem("agenda", agendaInput);
                      setAgendaInput("");
                    }
                  }}
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  {formValues.agenda?.map((item) => (
                    <div
                      className="pill flex items-center gap-2 border border-dark-200"
                      key={item}
                    >
                      <span>{item}</span>
                      <button
                        type="button"
                        className="text-light-100 text-xs hover:text-white"
                        onClick={() => removeListItem("agenda", item)}
                        aria-label={`Remove ${item}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative w-full">
                <p className="absolute -top-3 left-2 bg-dark-200 rounded px-2">
                  Tags
                </p>
                <input
                  className="bg-dark-200 rounded-[6px] px-5 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary h-12 w-full"
                  name="tags"
                  placeholder="Type a tag and press Enter"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addListItem("tags", tagsInput);
                      setTagsInput("");
                    }
                  }}
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  {formValues.tags?.map((item) => (
                    <div
                      className="pill flex items-center gap-2 border border-dark-200"
                      key={item}
                    >
                      <span>{item}</span>
                      <button
                        type="button"
                        className="text-light-100 text-xs hover:text-white"
                        onClick={() => removeListItem("tags", item)}
                        aria-label={`Remove ${item}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="bg-primary hover:bg-primary/90 w-full cursor-pointer items-center justify-center rounded-[6px] px-4 py-2.5 text-lg font-semibold text-black"
              >
                Create Event
              </button>
            </form>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default CreateEvent;
