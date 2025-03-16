import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Minus, Upload, Loader2 } from 'lucide-react';
import Input from '../common/Input';

// Updated schema to match the desired JSON structure
const diseaseSchema = z.object({
  hospital_id: z.string().min(1, 'Hospital ID is required'),
  cases_by_age_gender: z.object({
    '0-18': z.object({ male: z.number().min(0), female: z.number().min(0) }),
    '19-35': z.object({ male: z.number().min(0), female: z.number().min(0) }),
    '36-50': z.object({ male: z.number().min(0), female: z.number().min(0) }),
    '51-65': z.object({ male: z.number().min(0), female: z.number().min(0) }),
    '65+': z.object({ male: z.number().min(0), female: z.number().min(0) }),
  }),
  name: z.string().min(1, 'Disease name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  symptoms: z.array(z.string().min(1, 'Symptom cannot be empty')).min(1, 'At least one symptom is required'),
  mild_cases: z.number().min(0, 'Mild cases must be 0 or greater'),
  moderate_cases: z.number().min(0, 'Moderate cases must be 0 or greater'),
  severe_cases: z.number().min(0, 'Severe cases must be 0 or greater'),
  total_case_registered: z.number().min(0, 'Total cases must be 0 or greater'),
  active_case: z.number().min(0, 'Active cases must be 0 or greater'),
  hotspot: z.array(z.string().min(1, 'Hotspot cannot be empty')).min(1, 'At least one hotspot is required'),
  disease_type: z.string().min(1, 'Disease type is required'),
  disease_recovery_rate: z.number().min(0).max(100, 'Recovery rate must be between 0 and 100'),
  total_deaths: z.number().min(0, 'Total deaths must be 0 or greater'),
  occupied_beds: z.number().min(0, 'Occupied beds must be 0 or greater'),
  occupied_ventilators: z.number().min(0, 'Occupied ventilators must be 0 or greater'),
  occupied_oxygen: z.number().min(0, 'Occupied oxygen must be 0 or greater'),
  isolation_ward_status: z.enum(['Available', 'Full', 'Not Available']),
  oxygen_supply_status: z.enum(['Stable', 'Low', 'Critical']),
  ppe_kit_availability: z.enum(['Sufficient', 'Limited', 'Out of Stock']),
  mortality_rate: z.number().min(0).max(100, 'Mortality rate must be between 0 and 100'),
  vaccinated_coverage: z.number().min(0).max(100, 'Vaccinated coverage must be between 0 and 100'),
  symptoms_severity: z.enum(['Mild', 'Moderate', 'Severe', 'Critical']),
  seasonal_pattern: z.enum(['Winter', 'Summer', 'Monsoon', 'All Seasons']),
  hospital_emergency_admission_rate: z.number().min(0).max(100, 'Admission rate must be between 0 and 100'),
  icu_utilization: z.number().min(0).max(100, 'ICU utilization must be between 0 and 100'),
  date: z.string().min(1, 'Date is required'), // Accepts any string format

});

type DiseaseData = z.infer<typeof diseaseSchema>;

const DiseaseDataEntry: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [apiMessage, setApiMessage] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [entryMethod, setEntryMethod] = React.useState<'manual' | 'upload' | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<DiseaseData>({
    resolver: zodResolver(diseaseSchema),
    defaultValues: {
      hospital_id: localStorage.getItem('hospital_id') || '',
      cases_by_age_gender: {
        '0-18': { male: 0, female: 0 },
        '19-35': { male: 0, female: 0 },
        '36-50': { male: 0, female: 0 },
        '51-65': { male: 0, female: 0 },
        '65+': { male: 0, female: 0 },
      },
      name: '',
      description: '',
      symptoms: [],
      mild_cases: 0,
      moderate_cases: 0,
      severe_cases: 0,
      total_case_registered: 0,
      active_case: 0,
      hotspot: [''],
      disease_type: '',
      disease_recovery_rate: 0,
      total_deaths: 0,
      occupied_beds: 0,
      occupied_ventilators: 0,
      occupied_oxygen: 0,
      isolation_ward_status: 'Available',
      oxygen_supply_status: 'Stable',
      ppe_kit_availability: 'Sufficient',
      mortality_rate: 0,
      vaccinated_coverage: 0,
      symptoms_severity: 'Mild',
      seasonal_pattern: 'All Seasons',
      hospital_emergency_admission_rate: 0,
      icu_utilization: 0,
      date: new Date().toISOString(), // Full ISO format
    },
  });

  // Predefined symptoms for checkbox selection
  const predefinedSymptoms = [
    'Fever',
    'Cough',
    'Shortness of Breath',
    'Fatigue',
    'Headache',
    'Sore Throat',
    'Nausea',
    'Diarrhea',
  ];

  // Watch the symptoms field to manage checkbox state
  const selectedSymptoms = watch('symptoms') || [];

  // Handle checkbox change for symptoms
  const handleSymptomChange = (symptom: string, checked: boolean) => {
    const currentSymptoms = selectedSymptoms || [];
    if (checked) {
      setValue('symptoms', [...currentSymptoms, symptom]);
    } else {
      setValue(
        'symptoms',
        currentSymptoms.filter((s) => s !== symptom)
      );
    }
  };

  React.useEffect(() => {
    const hospitalId = localStorage.getItem('hospital_id');
    if (hospitalId) {
      setValue('hospital_id', hospitalId);
    } else {
      setApiMessage({ type: 'error', message: 'No hospital ID found. Please log in again.' });
    }
  }, [setValue]);

  const onSubmit = async (data: DiseaseData) => {
    setIsSubmitting(true);
    setApiMessage(null);

    const hospitalId = localStorage.getItem('hospital_id');
    const token = localStorage.getItem('authToken');

    if (!hospitalId || !token) {
      setApiMessage({ type: 'error', message: 'Authentication issue. Please log in again.' });
      setIsSubmitting(false);
      return;
    }

    const requestData = { ...data, hospital_id: hospitalId };
    console.log('Submitting Data:', requestData);

    try {
      const response = await fetch('https://diseases-backend-pi.vercel.app/api/v1/hospital/disease/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setApiMessage({ type: 'success', message: `Disease added successfully! Hospital ID: ${hospitalId}` });
        reset();
        setEntryMethod(null);
      } else {
        setApiMessage({ type: 'error', message: result.message || 'Submission failed' });
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      setApiMessage({ type: 'error', message: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (file: File | null) => {
    if (!file) return;

    if (!file.name.endsWith('.xlsx')) {
      setApiMessage({ type: 'error', message: 'Please upload only .xlsx files' });
      return;
    }

    const hospitalId = localStorage.getItem('hospital_id');
    if (!hospitalId) {
      setApiMessage({ type: 'error', message: 'Hospital ID is missing.' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'Disease');
    formData.append('folder', 'diseases-files');

    setIsSubmitting(true);
    setApiMessage(null);

    try {
      const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/djhsyvxvy/raw/upload', {
        method: 'POST',
        body: formData,
      });

      const cloudinaryResult = await cloudinaryResponse.json();
      if (!cloudinaryResponse.ok) {
        throw new Error(cloudinaryResult.error?.message || 'Failed to upload file to Cloudinary');
      }

      const backendData = { hospital_id: hospitalId, fileUrl: cloudinaryResult.secure_url };
      const backendResponse = await fetch('https://diseases-backend-pi.vercel.app/api/v1/hospital/disease/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(backendData),
      });

      const backendResult = await backendResponse.json();
      if (!backendResponse.ok) {
        throw new Error(backendResult.message || 'Failed to process file in backend');
      }

      setApiMessage({ type: 'success', message: backendResult.message || 'Disease data uploaded successfully!' });
      setEntryMethod(null);
    } catch (error) {
      console.error('Upload Error:', error);
      setApiMessage({
        type: 'error',
        message: error instanceof Error ? error.message : 'An error occurred during file upload.',
      });
    } finally {
      setIsSubmitting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const ageGroups = ['0-18', '19-35', '36-50', '51-65', '65+'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Disease Registration Form</h1>

          {apiMessage && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-center ${
                apiMessage.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              <span className="mr-2">{apiMessage.type === 'success' ? '✅' : '❌'}</span>
              {apiMessage.message}
            </div>
          )}

          {!entryMethod ? (
            <div className="text-center space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">Choose Entry Method</h2>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => setEntryMethod('upload')}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
                >
                  Upload CSV/Excel File
                </button>
                <button
                  onClick={() => setEntryMethod('manual')}
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

              {entryMethod === 'upload' && (
                <section className="mb-12">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Upload Disease Data</h2>
                  <div
                    className={`relative group rounded-xl border-2 transition-all duration-200 ${
                      isDragging
                        ? 'border-indigo-500 bg-indigo-50/50 shadow-lg'
                        : 'border-gray-200 bg-gray-50 hover:border-indigo-300'
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
                            isDragging ? 'bg-indigo-100' : 'bg-gray-100'
                          } transition-colors duration-200`}
                        >
                          <Upload className={`h-8 w-8 ${isDragging ? 'text-indigo-600' : 'text-gray-500'}`} />
                        </div>
                        <div className="space-y-2">
                          <p className="text-gray-700 font-medium">
                            {isDragging ? 'Drop your file here!' : 'Drag & drop your file here'}
                          </p>
                          <p className="text-sm text-gray-500">or</p>
                        </div>
                        <label
                          htmlFor="file-upload"
                          className={`inline-flex items-center px-5 py-2.5 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-md transition-all duration-200 ${
                            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          <Upload className="h-5 w-5 mr-2" />
                          Browse Files
                        </label>
                      </div>
                      <div className="mt-4 text-sm text-gray-500">Supported format: .xlsx only | Maximum size: 10MB</div>
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

              {entryMethod === 'manual' && (
                <section className="space-y-8">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Manual Disease Entry</h2>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Basic Information */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold text-gray-700 mb-4">Basic Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Disease Name</label>
                          <Input
                            {...register('name')}
                            error={errors.name?.message}
                            placeholder="Enter disease name"
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Disease Type</label>
                          <Input
                            {...register('disease_type')}
                            error={errors.disease_type?.message}
                            placeholder="e.g., Viral, Bacterial"
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                          <Input
                            multiline
                            {...register('description')}
                            error={errors.description?.message}
                            placeholder="Enter disease description"
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                          />
                        </div>
                        <div>
  <label className="block text-sm font-medium text-gray-600 mb-1">Date</label>
  <Input
    type="datetime-local"
    defaultValue={new Date().toISOString().slice(0, 16)} // Ensure format is "YYYY-MM-DDTHH:MM"
    {...register('date', {
      setValueAs: (value) => (value ? value.slice(0, 16) : ''), // Ensures format is "YYYY-MM-DDTHH:MM"
    })}
    error={errors.date?.message}
    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
  />
</div>

                      </div>
                    </div>

                    {/* Cases by Age and Gender */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold text-gray-700 mb-4">Cases by Age and Gender</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {ageGroups.map((ageGroup) => (
                          <div key={ageGroup} className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-600">{ageGroup}</label>
                            <div className="flex gap-2">
                              <Input
                                type="number"
                                {...register(`cases_by_age_gender.${ageGroup}.male`, { valueAsNumber: true })}
                                placeholder="Male"
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                              />
                              <Input
                                type="number"
                                {...register(`cases_by_age_gender.${ageGroup}.female`, { valueAsNumber: true })}
                                placeholder="Female"
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                              />
                            </div>
                            <div className="flex gap-4">
                              {errors.cases_by_age_gender?.[ageGroup]?.male && (
                                <p className="text-red-500 text-sm">
                                  {errors.cases_by_age_gender[ageGroup].male.message}
                                </p>
                              )}
                              {errors.cases_by_age_gender?.[ageGroup]?.female && (
                                <p className="text-red-500 text-sm">
                                  {errors.cases_by_age_gender[ageGroup].female.message}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Symptoms and Hotspots */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">Symptoms</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {predefinedSymptoms.map((symptom) => (
                            <label key={symptom} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={selectedSymptoms.includes(symptom)}
                                onChange={(e) => handleSymptomChange(symptom, e.target.checked)}
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                              />
                              <span className="text-sm text-gray-700">{symptom}</span>
                            </label>
                          ))}
                        </div>
                        {errors.symptoms && <p className="text-red-500 text-sm mt-4">{errors.symptoms.message}</p>}
                      </div>
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">Hotspots</h3>
                        <Input
                          {...register('hotspot.0')}
                          placeholder="Enter hotspot location (e.g., Area 1)"
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all mb-2"
                        />
                        <Input
                          {...register('hotspot.1')}
                          placeholder="Enter hotspot location (e.g., Area 2)"
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        />
                        {errors.hotspot && <p className="text-red-500 text-sm mt-2">{errors.hotspot.message}</p>}
                      </div>
                    </div>

                    {/* Case Statistics */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold text-gray-700 mb-4">Case Statistics</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                          { name: 'mild_cases', label: 'Mild Cases' },
                          { name: 'moderate_cases', label: 'Moderate Cases' },
                          { name: 'severe_cases', label: 'Severe Cases' },
                          { name: 'total_case_registered', label: 'Total Cases Registered' },
                          { name: 'active_case', label: 'Active Cases' },
                          { name: 'total_deaths', label: 'Total Deaths' },
                        ].map((field) => (
                          <div key={field.name}>
                            <label className="block text-sm font-medium text-gray-600 mb-1">{field.label}</label>
                            <Input
                              type="number"
                              {...register(field.name, { valueAsNumber: true })}
                              error={errors[field.name]?.message}
                              placeholder={`Enter ${field.label.toLowerCase()}`}
                              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Resource Utilization */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold text-gray-700 mb-4">Resource Utilization</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                          { name: 'occupied_beds', label: 'Occupied Beds', type: 'number' },
                          { name: 'occupied_ventilators', label: 'Occupied Ventilators', type: 'number' },
                          { name: 'occupied_oxygen', label: 'Occupied Oxygen (L/day)', type: 'number' },
                        ].map((field) => (
                          <div key={field.name}>
                            <label className="block text-sm font-medium text-gray-600 mb-1">{field.label}</label>
                            <Input
                              type="number"
                              {...register(field.name, { valueAsNumber: true })}
                              error={errors[field.name]?.message}
                              placeholder={`Enter ${field.label.toLowerCase()}`}
                              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            />
                          </div>
                        ))}
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Isolation Ward Status</label>
                          <select
                            {...register('isolation_ward_status')}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                          >
                            {['Available', 'Full', 'Not Available'].map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                          {errors.isolation_ward_status && (
                            <p className="text-red-500 text-sm mt-1">{errors.isolation_ward_status.message}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Oxygen Supply Status</label>
                          <select
                            {...register('oxygen_supply_status')}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                          >
                            {['Stable', 'Low', 'Critical'].map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                          {errors.oxygen_supply_status && (
                            <p className="text-red-500 text-sm mt-1">{errors.oxygen_supply_status.message}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">PPE Kit Availability</label>
                          <select
                            {...register('ppe_kit_availability')}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                          >
                            {['Sufficient', 'Limited', 'Out of Stock'].map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                          {errors.ppe_kit_availability && (
                            <p className="text-red-500 text-sm mt-1">{errors.ppe_kit_availability.message}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Disease Characteristics */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold text-gray-700 mb-4">Disease Characteristics</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                          { name: 'disease_recovery_rate', label: 'Recovery Rate (%)', type: 'number' },
                          { name: 'mortality_rate', label: 'Mortality Rate (%)', type: 'number' },
                          { name: 'vaccinated_coverage', label: 'Vaccinated Coverage (%)', type: 'number' },
                          {
                            name: 'hospital_emergency_admission_rate',
                            label: 'Emergency Admission Rate (%)',
                            type: 'number',
                          },
                          { name: 'icu_utilization', label: 'ICU Utilization (%)', type: 'number' },
                        ].map((field) => (
                          <div key={field.name}>
                            <label className="block text-sm font-medium text-gray-600 mb-1">{field.label}</label>
                            <Input
                              type="number"
                              {...register(field.name, { valueAsNumber: true })}
                              error={errors[field.name]?.message}
                              placeholder={`Enter ${field.label.toLowerCase()}`}
                              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            />
                          </div>
                        ))}
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Symptoms Severity</label>
                          <select
                            {...register('symptoms_severity')}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                          >
                            {['Mild', 'Moderate', 'Severe', 'Critical'].map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                          {errors.symptoms_severity && (
                            <p className="text-red-500 text-sm mt-1">{errors.symptoms_severity.message}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Seasonal Pattern</label>
                          <select
                            {...register('seasonal_pattern')}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                          >
                            {['Winter', 'Summer', 'Monsoon', 'All Seasons'].map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                          {errors.seasonal_pattern && (
                            <p className="text-red-500 text-sm mt-1">{errors.seasonal_pattern.message}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
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
                          'Submit Disease Data'
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