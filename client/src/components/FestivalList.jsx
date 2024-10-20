import { Carousel } from "flowbite-react";
import { FiX } from "react-icons/fi";
import { useState } from "react";

export default function FestivalList({ temple, setTemple, setAlert }) {
    const [isExpanded, setIsExpanded] = useState({}); // To handle "Show More/Show Less" per festival

    // Toggle the "Show More/Show Less" for each festival description
    const toggleExpanded = (index) => {
        setIsExpanded((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    // Remove a festival from the list
    const handleRemoveFestival = async (index) => {
        const updatedFestivals = {
            festivals: temple.festivals.filter((_, i) => i !== index),
        };

        try {
            const response = await fetch(`/api/temple/edit/${temple._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ templeData: updatedFestivals }),
            });

            const data = await response.json();
            if (!response.ok) {
                return setAlert({ type: "error", message: data.message });
            }

            setTemple(data.temple);
            setAlert({ type: "success", message: "Festival removed successfully!" });
        } catch (error) {
            setAlert({ type: "error", message: "Error removing festival." });
        }
    };

    return (
        <>
            <h2 className="text-xl font-bold my-4">Festival List</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {temple.festivals.map((festival, festivalIndex) => (
                    <div
                        key={festivalIndex}
                        className="bg-white dark:bg-gray-700 shadow-md rounded-lg overflow-hidden"
                    >
                        <div className="relative">
                            {/* Carousel for festival images */}
                            {festival.festivalImages.length > 0 ? (
                                <Carousel className="w-full h-40" pauseOnHover>
                                    {festival.festivalImages.map((img, index) => (
                                        <img
                                            key={index}
                                            src={img}
                                            className="w-full h-40 object-cover"
                                            alt="Festival"
                                        />
                                    ))}
                                </Carousel>
                            ) : (
                                <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-600">No Images Available</span>
                                </div>
                            )}

                            {/* Remove button */}
                            <button
                                className="absolute top-2 right-2 bg-white text-black p-1 dark:bg-gray-600 dark:text-white rounded-full opacity-75 hover:opacity-100"
                                onClick={() => handleRemoveFestival(festivalIndex)}
                            >
                                <FiX size={16} />
                            </button>
                        </div>

                        {/* Card content */}
                        <div className="p-4">
                            {/* Festival Name */}
                            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {festival.festivalName}
                            </h1>

                            {/* Festival Description */}
                            <p
                                className={`text-gray-600 dark:text-gray-300 mt-2 text-xs transition-all duration-300 overflow-hidden ${
                                    isExpanded[festivalIndex] ? "" : "line-clamp-3"
                                }`}
                            >
                                {festival.festivalImportance}
                            </p>

                            {/* Show More/Show Less */}
                            {festival.festivalImportance &&
                                festival.festivalImportance.length > 100 && (
                                    <button
                                        className="text-blue-500 hover:underline text-sm mt-2"
                                        onClick={() => toggleExpanded(festivalIndex)}
                                    >
                                        {isExpanded[festivalIndex] ? "Show Less" : "Show More"}
                                    </button>
                                )}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
