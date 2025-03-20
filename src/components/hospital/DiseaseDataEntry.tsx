import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Minus, Upload, Loader2 } from "lucide-react";
import Input from "../common/Input";
import { useSelector } from "react-redux";

// Updated schema
const diseaseSchema = z.object({
  hospital_id: z.string().min(1, "Hospital ID is required"),
  cases_by_age_gender: z
    .array(
      z.object({
        age_group: z.string().min(1, "Age group is required"),
        male: z.number().min(0, "Male cases must be 0 or greater"),
        female: z.number().min(0, "Female cases must be 0 or greater"),
      })
    )
    .min(1, "At least one age group entry is required"),
  name: z.string().min(1, "Disease name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  symptoms: z
    .array(z.string().min(1, "Symptom cannot be empty"))
    .min(1, "At least one symptom is required"),
  mild_cases: z.number().min(0, "Mild cases must be 0 or greater"),
  moderate_cases: z.number().min(0, "Moderate cases must be 0 or greater"),
  severe_cases: z.number().min(0, "Severe cases must be 0 or greater"),
  total_case_registered: z.number().min(0, "Total cases must be 0 or greater"),
  active_case: z.number().min(0, "Active cases must be 0 or greater"),
  hotspot: z
    .array(
      z.object({
        district: z.string().min(1, "District is required"),
        area: z.string().min(1, "Area is required"),
      })
    )
    .min(1, "At least one hotspot is required"),
  disease_type: z.string().min(1, "Disease type is required"),
  disease_recovery_rate: z
    .number()
    .min(0)
    .max(100, "Recovery rate must be between 0 and 100"),
  total_deaths: z.number().min(0, "Total deaths must be 0 or greater"),
  occupied_beds: z.number().min(0, "Occupied beds must be 0 or greater"),
  occupied_ventilators: z
    .number()
    .min(0, "Occupied ventilators must be 0 or greater"),
  occupied_oxygen: z.number().min(0, "Occupied oxygen must be 0 or greater"),
  isolation_ward_status: z.enum(["Available", "Full", "Not Available"]),
  oxygen_supply_status: z.enum(["Stable", "Low", "Critical"]),
  ppe_kit_availability: z.enum(["Sufficient", "Limited", "Out of Stock"]),
  mortality_rate: z
    .number()
    .min(0)
    .max(100, "Mortality rate must be between 0 and 100"),
  vaccinated_coverage: z
    .number()
    .min(0)
    .max(100, "Vaccinated coverage must be between 0 and 100"),
  symptoms_severity: z.enum(["Mild", "Moderate", "Severe", "Critical"]),
  seasonal_pattern: z.enum(["Winter", "Summer", "Monsoon", "All Seasons"]),
  hospital_emergency_admission_rate: z
    .number()
    .min(0)
    .max(100, "Admission rate must be between 0 and 100"),
  icu_utilization: z
    .number()
    .min(0)
    .max(100, "ICU utilization must be between 0 and 100"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
});

type DiseaseData = z.infer<typeof diseaseSchema>;

// List of Gujarat districts
const gujaratDistricts = [
  "Ahmedabad",
  "Amreli",
  "Anand",
  "Aravalli",
  "Banaskantha",
  "Bharuch",
  "Bhavnagar",
  "Botad",
  "Chhota Udaipur",
  "Dahod",
  "Dang",
  "Devbhoomi Dwarka",
  "Gandhinagar",
  "Gir Somnath",
  "Jamnagar",
  "Junagadh",
  "Kheda",
  "Kutch",
  "Mahisagar",
  "Mehsana",
  "Morbi",
  "Narmada",
  "Navsari",
  "Panchmahal",
  "Patan",
  "Porbandar",
  "Rajkot",
  "Sabarkantha",
  "Surat",
  "Surendranagar",
  "Tapi",
  "Vadodara",
  "Valsad",
];

const DiseaseDataEntry: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [apiMessage, setApiMessage] = React.useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [entryMethod, setEntryMethod] = React.useState<
    "manual" | "upload" | null
  >(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  // const { isAuth, role, email, hospitalId } = useSelector(
  //   (state) => state.auth
  // );
  const hospitalId = useSelector((state) => state.auth.email);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<DiseaseData>({
    resolver: zodResolver(diseaseSchema),
    defaultValues: {
      hospital_id: localStorage.getItem("hospital_id") || "",
      cases_by_age_gender: [{ age_group: "", male: 0, female: 0 }],
      name: "",
      description: "",
      symptoms: [],
      mild_cases: 0,
      moderate_cases: 0,
      severe_cases: 0,
      total_case_registered: 0,
      active_case: 0,
      hotspot: [{ district: "", area: "" }],
      disease_type: "",
      disease_recovery_rate: 0,
      total_deaths: 0,
      occupied_beds: 0,
      occupied_ventilators: 0,
      occupied_oxygen: 0,
      isolation_ward_status: "Available",
      oxygen_supply_status: "Stable",
      ppe_kit_availability: "Sufficient",
      mortality_rate: 0,
      vaccinated_coverage: 0,
      symptoms_severity: "Mild",
      seasonal_pattern: "All Seasons",
      hospital_emergency_admission_rate: 0,
      icu_utilization: 0,
      date: new Date().toISOString().split("T")[0],
    },
  });

  const {
    fields: ageFields,
    append: appendAge,
    remove: removeAge,
  } = useFieldArray({
    control,
    name: "cases_by_age_gender",
  });

  const {
    fields: hotspotFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "hotspot",
  });

  const predefinedSymptoms = [
    "Fever",
    "Cough",
    "Shortness of Breath",
    "Fatigue",
    "Headache",
    "Sore Throat",
    "Nausea",
    "Diarrhea",
  ];

  const selectedSymptoms = watch("symptoms") || [];

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    const currentSymptoms = selectedSymptoms || [];
    if (checked) {
      setValue("symptoms", [...currentSymptoms, symptom]);
    } else {
      setValue(
        "symptoms",
        currentSymptoms.filter((s) => s !== symptom)
      );
    }
  };

  React.useEffect(() => {
    // console.log("is auth :" + isAuth + " and role : " + email);
    console.log("Hospital ID:", hospitalId);
    if (hospitalId) {
      setValue("hospital_id", hospitalId);
    } else {
      setApiMessage({
        type: "error",
        message: "No hospital ID found. Please log in again.",
      });
    }
  }, [setValue]);

  const onSubmit = async (data: DiseaseData) => {
    setIsSubmitting(true);
    setApiMessage(null);

    if (!hospitalId) {
      setApiMessage({
        type: "error",
        message: "Hospital ID is missing. Please try again.",
      });
      setIsSubmitting(false);
      return;
    }

    const combinedHotspots = data.hotspot
      .filter((hotspot) => hotspot.district && hotspot.area)
      .map((hotspot) => `${hotspot.district} - ${hotspot.area}`);

    const requestData = {
      ...data,
      hospital_id: hospitalId,
      hotspot: combinedHotspots,
    };
    console.log("Submitting Data:", requestData);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_VERCEL}/api/v1/hospital/disease/register`,

        // "https://diseases-backend-pi.vercel.app/api/v1/hospital/disease/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      const result = await response.json();
      console.log("API Response:", { status: response.status, result });

      if (response.status === 200 || response.status === 201) {
        if (
          result.message &&
          result.message.toLowerCase().includes("successfully")
        ) {
          setApiMessage({
            type: "success",
            message:
              result.message ||
              `Disease created successfully! Hospital ID: ${hospitalId}`,
          });
          reset();
          setEntryMethod(null);
        } else {
          setApiMessage({
            type: "error",
            message: result.message || "Failed to create disease",
          });
        }
      } else {
        setApiMessage({
          type: "error",
          message:
            result.message ||
            `Error ${response.status}: Failed to create disease`,
        });
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setApiMessage({
        type: "error",
        message: "An error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (file: File | null) => {
    if (!file) return;

    if (!file.name.endsWith(".xlsx")) {
      setApiMessage({
        type: "error",
        message: "Please upload only .xlsx files",
      });
      return;
    }

    if (!hospitalId) {
      setApiMessage({ type: "error", message: "Hospital ID is missing." });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Disease");
    formData.append("folder", "diseases-files");

    setIsSubmitting(true);
    setApiMessage(null);

    try {
      const cloudinaryResponse = await fetch(
        "https://api.cloudinary.com/v1_1/djhsyvxvy/raw/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const cloudinaryResult = await cloudinaryResponse.json();
      if (!cloudinaryResponse.ok) {
        throw new Error(
          cloudinaryResult.error?.message ||
            "Failed to upload file to Cloudinary"
        );
      }

      const backendData = {
        hospital_id: hospitalId,
        fileUrl: cloudinaryResult.secure_url,
      };
      const backendResponse = await fetch(
        `${import.meta.env.VITE_API_VERCEL}/api/v1/hospital/disease/upload`,
        // "https://diseases-backend-pi.vercel.app/api/v1/hospital/disease/upload",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(backendData),
        }
      );

      const backendResult = await backendResponse.json();
      if (!backendResponse.ok) {
        throw new Error(
          backendResult.message || "Failed to process file in backend"
        );
      }

      setApiMessage({
        type: "success",
        message: backendResult.message || "Disease data uploaded successfully!",
      });
      setEntryMethod(null);
    } catch (error) {
      console.error("Upload Error:", error);
      setApiMessage({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "An error occurred during file upload.",
      });
    } finally {
      setIsSubmitting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const ageGroupOptions = ["0-18", "19-35", "36-50", "51-65", "65+"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Disease Registration Form
          </h1>

          {apiMessage && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-center ${
                apiMessage.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              <span className="mr-2">
                {apiMessage.type === "success" ? "✅" : "❌"}
              </span>
              {apiMessage.message}
            </div>
          )}

          {!entryMethod ? (
            <div className="text-center space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Choose Entry Method
              </h2>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => setEntryMethod("upload")}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
                >
                  Upload CSV/Excel File
                </button>
                <button
                  onClick={() => setEntryMethod("manual")}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
                >
                  Manual Entry
                </button>
              </div>
            </div>
          ) : (
            <>
              <button
                onClick={() => setEntryMethod(null)}
                className="mb-6 text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                ← Back to Options
              </button>

              {entryMethod === "upload" && (
                <section className="mb-12">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    Upload Disease Data
                  </h2>
                  <div
                    className={`relative group rounded-xl border-2 transition-all duration-200 ${
                      isDragging
                        ? "border-indigo-500 bg-indigo-50/50 shadow-lg"
                        : "border-gray-200 bg-gray-50 hover:border-indigo-300"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="p-8 text-center">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept=".xlsx"
                        onChange={handleFileInputChange}
                        className="hidden"
                        id="file-upload"
                        disabled={isSubmitting}
                      />
                      <div className="flex flex-col items-center gap-4">
                        <div
                          className={`p-3 rounded-full ${
                            isDragging ? "bg-indigo-100" : "bg-gray-100"
                          } transition-colors duration-200`}
                        >
                          <Upload
                            className={`h-8 w-8 ${
                              isDragging ? "text-indigo-600" : "text-gray-500"
                            }`}
                          />
                        </div>
                        <div className="space-y-2">
                          <p className="text-gray-700 font-medium">
                            {isDragging
                              ? "Drop your file here!"
                              : "Drag & drop your file here"}
                          </p>
                          <p className="text-sm text-gray-500">or</p>
                        </div>
                        <label
                          htmlFor="file-upload"
                          className={`inline-flex items-center px-5 py-2.5 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-md transition-all duration-200 ${
                            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          <Upload className="h-5 w-5 mr-2" />
                          Browse Files
                        </label>
                      </div>
                      <div className="mt-4 text-sm text-gray-500">
                        Supported format: .xlsx only | Maximum size: 10MB
                      </div>
                      {isSubmitting && (
                        <div className="mt-6 flex items-center justify-center gap-2 text-indigo-600">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span className="text-sm">Uploading...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              )}

              {entryMethod === "manual" && (
                <section className="space-y-8">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                    Manual Disease Entry
                  </h2>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold text-gray-700 mb-4">
                        Basic Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Disease Name
                          </label>
                          <Input
                            {...register("name")}
                            error={errors.name?.message}
                            placeholder="e.g., Influenza"
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Disease Type
                          </label>
                          <Input
                            {...register("disease_type")}
                            error={errors.disease_type?.message}
                            placeholder="e.g., Viral"
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Description
                          </label>
                          <Input
                            multiline
                            {...register("description")}
                            error={errors.description?.message}
                            placeholder="Describe the disease (min 10 characters)"
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Date
                          </label>
                          <Input
                            type="date"
                            {...register("date")}
                            defaultValue={
                              new Date().toISOString().split("T")[0]
                            }
                            error={errors.date?.message}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold text-gray-700 mb-4">
                        Cases by Age and Gender
                      </h3>
                      {ageFields.map((field, index) => (
                        <div
                          key={field.id}
                          className="flex flex-col gap-3 mb-4"
                        >
                          <div className="flex items-center gap-2">
                            <select
                              {...register(
                                `cases_by_age_gender.${index}.age_group`
                              )}
                              className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            >
                              <option value="">Select Age Group</option>
                              {ageGroupOptions.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                            <div className="flex-1">
                              <label className="block text-sm font-medium text-gray-600 mb-1">
                                Total Male
                              </label>
                              <Input
                                type="number"
                                {...register(
                                  `cases_by_age_gender.${index}.male`,
                                  { valueAsNumber: true }
                                )}
                                placeholder="Enter total male cases"
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                              />
                            </div>
                            <div className="flex-1">
                              <label className="block text-sm font-medium text-gray-600 mb-1">
                                Total Female
                              </label>
                              <Input
                                type="number"
                                {...register(
                                  `cases_by_age_gender.${index}.female`,
                                  { valueAsNumber: true }
                                )}
                                placeholder="Enter total female cases"
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeAge(index)}
                              className="p-2 text-red-500 hover:text-red-600 transition-colors"
                            >
                              <Minus size={20} />
                            </button>
                          </div>
                          <div className="flex gap-4">
                            {errors.cases_by_age_gender?.[index]?.age_group && (
                              <p className="text-red-500 text-sm">
                                {
                                  errors.cases_by_age_gender[index].age_group
                                    .message
                                }
                              </p>
                            )}
                            {errors.cases_by_age_gender?.[index]?.male && (
                              <p className="text-red-500 text-sm">
                                {errors.cases_by_age_gender[index].male.message}
                              </p>
                            )}
                            {errors.cases_by_age_gender?.[index]?.female && (
                              <p className="text-red-500 text-sm">
                                {
                                  errors.cases_by_age_gender[index].female
                                    .message
                                }
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          appendAge({ age_group: "", male: 0, female: 0 })
                        }
                        className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
                      >
                        <Plus size={20} /> Add Age Group
                      </button>
                      {errors.cases_by_age_gender &&
                        !errors.cases_by_age_gender[0] && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.cases_by_age_gender.message}
                          </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">
                          Symptoms
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          {predefinedSymptoms.map((symptom) => (
                            <label
                              key={symptom}
                              className="flex items-center gap-2"
                            >
                              <input
                                type="checkbox"
                                checked={selectedSymptoms.includes(symptom)}
                                onChange={(e) =>
                                  handleSymptomChange(symptom, e.target.checked)
                                }
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                              />
                              <span className="text-sm text-gray-700">
                                {symptom}
                              </span>
                            </label>
                          ))}
                        </div>
                        {errors.symptoms && (
                          <p className="text-red-500 text-sm mt-4">
                            {errors.symptoms.message}
                          </p>
                        )}
                      </div>
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">
                          Hotspots
                        </h3>
                        {hotspotFields.map((field, index) => (
                          <div
                            key={field.id}
                            className="flex flex-col gap-3 mb-4"
                          >
                            <div className="flex items-center gap-2">
                              <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                  District Name
                                </label>
                                <select
                                  {...register(`hotspot.${index}.district`)}
                                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                >
                                  <option value="">Select District</option>
                                  {gujaratDistricts.map((district) => (
                                    <option key={district} value={district}>
                                      {district}
                                    </option>
                                  ))}
                                </select>
                                {errors.hotspot?.[index]?.district && (
                                  <p className="text-red-500 text-sm">
                                    {errors.hotspot[index].district.message}
                                  </p>
                                )}
                              </div>
                              <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                  Area Name
                                </label>
                                <input
                                  {...register(`hotspot.${index}.area`)}
                                  placeholder="e.g., Sector 15"
                                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                />
                                {errors.hotspot?.[index]?.area && (
                                  <p className="text-red-500 text-sm">
                                    {errors.hotspot[index].area.message}
                                  </p>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="p-2 text-red-500 hover:text-red-600 transition-colors"
                              >
                                <Minus size={20} />
                              </button>
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => append({ district: "", area: "" })}
                          className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
                        >
                          <Plus size={20} /> Add Hotspot
                        </button>
                        {errors.hotspot && !errors.hotspot[0] && (
                          <p className="text-red-500 text-sm mt-2">
                            {errors.hotspot.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold text-gray-700 mb-4">
                        Case Statistics
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                          { name: "mild_cases", label: "Mild Cases" },
                          { name: "moderate_cases", label: "Moderate Cases" },
                          { name: "severe_cases", label: "Severe Cases" },
                          {
                            name: "total_case_registered",
                            label: "Total Cases Registered",
                          },
                          { name: "active_case", label: "Active Cases" },
                          { name: "total_deaths", label: "Total Deaths" },
                        ].map((field) => (
                          <div key={field.name}>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              {field.label}
                            </label>
                            <Input
                              type="number"
                              {...register(field.name, { valueAsNumber: true })}
                              error={errors[field.name]?.message}
                              placeholder={`Enter number of ${field.label.toLowerCase()}`}
                              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold text-gray-700 mb-4">
                        Resource Utilization
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                          { name: "occupied_beds", label: "Occupied Beds" },
                          {
                            name: "occupied_ventilators",
                            label: "Occupied Ventilators",
                          },
                          {
                            name: "occupied_oxygen",
                            label: "Occupied Oxygen (L/day)",
                          },
                        ].map((field) => (
                          <div key={field.name}>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              {field.label}
                            </label>
                            <Input
                              type="number"
                              {...register(field.name, { valueAsNumber: true })}
                              error={errors[field.name]?.message}
                              placeholder={`Enter number of ${field.label.toLowerCase()}`}
                              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            />
                          </div>
                        ))}
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Isolation Ward Status
                          </label>
                          <select
                            {...register("isolation_ward_status")}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                          >
                            {["Available", "Full", "Not Available"].map(
                              (opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              )
                            )}
                          </select>
                          {errors.isolation_ward_status && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.isolation_ward_status.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Oxygen Supply Status
                          </label>
                          <select
                            {...register("oxygen_supply_status")}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                          >
                            {["Stable", "Low", "Critical"].map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                          {errors.oxygen_supply_status && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.oxygen_supply_status.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            PPE Kit Availability
                          </label>
                          <select
                            {...register("ppe_kit_availability")}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                          >
                            {["Sufficient", "Limited", "Out of Stock"].map(
                              (opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              )
                            )}
                          </select>
                          {errors.ppe_kit_availability && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.ppe_kit_availability.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold text-gray-700 mb-4">
                        Disease Characteristics
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                          {
                            name: "disease_recovery_rate",
                            label: "Recovery Rate (%)",
                          },
                          {
                            name: "mortality_rate",
                            label: "Mortality Rate (%)",
                          },
                          {
                            name: "vaccinated_coverage",
                            label: "Vaccinated Coverage (%)",
                          },
                          {
                            name: "hospital_emergency_admission_rate",
                            label: "Emergency Admission Rate (%)",
                          },
                          {
                            name: "icu_utilization",
                            label: "ICU Utilization (%)",
                          },
                        ].map((field) => (
                          <div key={field.name}>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              {field.label}
                            </label>
                            <Input
                              type="number"
                              {...register(field.name, { valueAsNumber: true })}
                              error={errors[field.name]?.message}
                              placeholder={`Enter ${field.label.toLowerCase()} (0-100)`}
                              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            />
                          </div>
                        ))}
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Symptoms Severity
                          </label>
                          <select
                            {...register("symptoms_severity")}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                          >
                            {["Mild", "Moderate", "Severe", "Critical"].map(
                              (opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              )
                            )}
                          </select>
                          {errors.symptoms_severity && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.symptoms_severity.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Seasonal Pattern
                          </label>
                          <select
                            {...register("seasonal_pattern")}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                          >
                            {["Winter", "Summer", "Monsoon", "All Seasons"].map(
                              (opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              )
                            )}
                          </select>
                          {errors.seasonal_pattern && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.seasonal_pattern.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-3 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Submit Disease Data"
                        )}
                      </button>
                    </div>
                  </form>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiseaseDataEntry;
