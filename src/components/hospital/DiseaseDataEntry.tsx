import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Minus, Upload, Loader2 } from 'lucide-react';
import Input from '../common/Input';

// Updated schema with all fields from your JSON
const diseaseSchema = z.object({
  hospital_id: z.string().min(1, 'Hospital ID is required'),
  age_group: z.string().min(1, 'Age group is required'),
  total_male: z.number().min(0, 'Total male must be 0 or greater'),
  total_female: z.number().min(0, 'Total female must be 0 or greater'),
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
  isolation_ward_status: z.string().min(1, 'Isolation ward status is required'),
  oxygen_supply_status: z.string().min(1, 'Oxygen supply status is required'),
  ppe_kit_availability: z.string().min(1, 'PPE kit availability is required'),
  mortality_rate: z.number().min(0).max(100, 'Mortality rate must be between 0 and 100'),
  vaccinated_coverage: z.number().min(0).max(100, 'Vaccinated coverage must be between 0 and 100'),
  symptoms_severity: z.string().min(1, 'Symptoms severity is required'),
  seasonal_pattern: z.string().min(1, 'Seasonal pattern is required'),
  hospital_emergency_admission_rate: z.number().min(0).max(100, 'Admission rate must be between 0 and 100'),
  icu_utilization: z.number().min(0).max(100, 'ICU utilization must be between 0 and 100'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

type DiseaseData = z.infer<typeof diseaseSchema>;

const DiseaseDataEntry: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [apiMessage, setApiMessage] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [entryMethod, setEntryMethod] = React.useState<'manual' | 'upload' | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<DiseaseData>({
    resolver: zodResolver(diseaseSchema),
    defaultValues: {
      hospital_id: localStorage.getItem('hospital_id') || '',
      age_group: '',
      total_male: 0,
      total_female: 0,
      name: '',
      description: '',
      symptoms: [''],
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
      isolation_ward_status: '',
      oxygen_supply_status: '',
      ppe_kit_availability: '',
      mortality_rate: 0,
      vaccinated_coverage: 0,
      symptoms_severity: '',
      seasonal_pattern: '',
      hospital_emergency_admission_rate: 0,
      icu_utilization: 0,
      date: new Date().toISOString().split('T')[0],
    },
  });

  const { fields: symptomFields, append: appendSymptom, remove: removeSymptom } = useFieldArray({
    control,
    name: 'symptoms',
  });

  const { fields: hotspotFields, append: appendHotspot, remove: removeHotspot } = useFieldArray({
    control,
    name: 'hotspot',
  });

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

    if (!hospitalId) {
      setApiMessage({ type: 'error', message: 'Hospital ID is missing. Please log in again.' });
      setIsSubmitting(false);
      return;
    }

    if (!token) {
      setApiMessage({ type: 'error', message: 'Authentication token is missing. Please log in again.' });
      setIsSubmitting(false);
      return;
    }

    const requestData = {
      ...data,
      hospital_id: hospitalId,
    };

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
      console.log('API Response:', result);

      if (response.ok && result.success) {
        setApiMessage({
          type: 'success',
          message: `Disease added successfully! Hospital ID: ${hospitalId}`,
        });
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const token = localStorage.getItem('authToken');
    if (!token) {
      setApiMessage({ type: 'error', message: 'Authentication token is missing. Please log in again.' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsSubmitting(true);
    setApiMessage(null);

    try {
      const response = await fetch('https://diseases-backend-pi.vercel.app/api/v1/hospital/disease/bulk-upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      const result = await response.json();
      console.log('Upload API Response:', result);

      if (response.ok && result.success) {
        setApiMessage({
          type: 'success',
          message: `Disease added successfully! Processed ${result.processed} records.${
            result.failed ? ` Failed: ${result.failed}` : ''
          }`,
        });
        setEntryMethod(null);
      } else {
        setApiMessage({ type: 'error', message: result.message || 'Upload failed' });
      }
    } catch (error) {
      console.error('Upload Fetch Error:', error);
      setApiMessage({ type: 'error', message: 'An error occurred during file upload.' });
    } finally {
      setIsSubmitting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Age group options for dropdown
  const ageGroupOptions = [
    '0-17',
    '18-25',
    '26-40',
    '41-60',
    '61+',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Disease Data Management</h1>

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
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Disease Data</h2>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept=".xlsx,.xls,.csv"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      disabled={isSubmitting}
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <Upload className="h-5 w-5 mr-2" />
                      Upload File
                    </label>
                    <span className="text-sm text-gray-500">Supported: .xlsx, .xls, .csv</span>
                  </div>
                </section>
              )}

              {entryMethod === 'manual' && (
                <section>
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Manual Disease Entry</h2>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <Input
                        label="Disease Name"
                        {...register('name')}
                        error={errors.name?.message}
                        placeholder="Enter disease name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <Input
                        label="Disease Type"
                        {...register('disease_type')}
                        error={errors.disease_type?.message}
                        placeholder="e.g., Viral, Bacterial"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <div className="md:col-span-2">
                        <Input
                          label="Description"
                          multiline
                          {...register('description')}
                          error={errors.description?.message}
                          placeholder="Enter disease description"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
                        <select
                          {...register('age_group')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="">Select age group</option>
                          {ageGroupOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        {errors.age_group && (
                          <p className="text-red-500 text-sm mt-1">{errors.age_group.message}</p>
                        )}
                      </div>
                      <Input
                        label="Total Male"
                        type="number"
                        {...register('total_male', { valueAsNumber: true })}
                        error={errors.total_male?.message}
                        placeholder="Enter total male cases"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <Input
                        label="Total Female"
                        type="number"
                        {...register('total_female', { valueAsNumber: true })}
                        error={errors.total_female?.message}
                        placeholder="Enter total female cases"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <Input
                        label="Date"
                        type="date"
                        {...register('date')}
                        error={errors.date?.message}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    {/* Symptoms */}
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms</label>
                      {symptomFields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-2 mb-3">
                          <input
                            {...register(`symptoms.${index}`)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter symptom"
                          />
                          <button
                            type="button"
                            onClick={() => removeSymptom(index)}
                            className="p-2 text-red-500 hover:text-red-600 transition-colors"
                          >
                            <Minus size={20} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => appendSymptom('')}
                        className="inline-flex items-center text-indigo-600 hover:text-indigo-700 transition-colors"
                      >
                        <Plus size={20} className="mr-1" />
                        Add Symptom
                      </button>
                      {errors.symptoms && <p className="text-red-500 text-sm mt-1">{errors.symptoms.message}</p>}
                    </div>

                    {/* Hotspots */}
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hotspots</label>
                      {hotspotFields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-2 mb-3">
                          <input
                            {...register(`hotspot.${index}`)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter location"
                          />
                          <button
                            type="button"
                            onClick={() => removeHotspot(index)}
                            className="p-2 text-red-500 hover:text-red-600 transition-colors"
                          >
                            <Minus size={20} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => appendHotspot('')}
                        className="inline-flex items-center text-indigo-600 hover:text-indigo-700 transition-colors"
                      >
                        <Plus size={20} className="mr-1" />
                        Add Hotspot
                      </button>
                      {errors.hotspot && <p className="text-red-500 text-sm mt-1">{errors.hotspot.message}</p>}
                    </div>

                    {/* Case Statistics */}
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Case Statistics</h3>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Input
                          label="Mild Cases"
                          type="number"
                          {...register('mild_cases', { valueAsNumber: true })}
                          error={errors.mild_cases?.message}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <Input
                          label="Moderate Cases"
                          type="number"
                          {...register('moderate_cases', { valueAsNumber: true })}
                          error={errors.moderate_cases?.message}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <Input
                          label="Severe Cases"
                          type="number"
                          {...register('severe_cases', { valueAsNumber: true })}
                          error={errors.severe_cases?.message}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <Input
                          label="Total Deaths"
                          type="number"
                          {...register('total_deaths', { valueAsNumber: true })}
                          error={errors.total_deaths?.message}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <Input
                          label="Total Cases Registered"
                          type="number"
                          {...register('total_case_registered', { valueAsNumber: true })}
                          error={errors.total_case_registered?.message}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <Input
                          label="Active Cases"
                          type="number"
                          {...register('active_case', { valueAsNumber: true })}
                          error={errors.active_case?.message}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    {/* Resource Utilization */}
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Resource Utilization</h3>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <Input
                          label="Occupied Beds"
                          type="number"
                          {...register('occupied_beds', { valueAsNumber: true })}
                          error={errors.occupied_beds?.message}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <Input
                          label="Occupied Ventilators"
                          type="number"
                          {...register('occupied_ventilators', { valueAsNumber: true })}
                          error={errors.occupied_ventilators?.message}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <Input
                          label="Occupied Oxygen (L/day)"
                          type="number"
                          {...register('occupied_oxygen', { valueAsNumber: true })}
                          error={errors.occupied_oxygen?.message}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <Input
                          label="Isolation Ward Status"
                          {...register('isolation_ward_status')}
                          error={errors.isolation_ward_status?.message}
                          placeholder="e.g., Available, Full"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <Input
                          label="Oxygen Supply Status"
                          {...register('oxygen_supply_status')}
                          error={errors.oxygen_supply_status?.message}
                          placeholder="e.g., Stable, Low"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <Input
                          label="PPE Kit Availability"
                          {...register('ppe_kit_availability')}
                          error={errors.ppe_kit_availability?.message}
                          placeholder="e.g., Sufficient, Limited"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    {/* Disease Characteristics */}
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Disease Characteristics</h3>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <Input
                          label="Mortality Rate (%)"
                          type="number"
                          {...register('mortality_rate', { valueAsNumber: true })}
                          error={errors.mortality_rate?.message}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <Input
                          label="Vaccinated Coverage (%)"
                          type="number"
                          {...register('vaccinated_coverage', { valueAsNumber: true })}
                          error={errors.vaccinated_coverage?.message}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <Input
                          label="Disease Recovery Rate (%)"
                          type="number"
                          {...register('disease_recovery_rate', { valueAsNumber: true })}
                          error={errors.disease_recovery_rate?.message}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <Input
                          label="Symptoms Severity"
                          {...register('symptoms_severity')}
                          error={errors.symptoms_severity?.message}
                          placeholder="e.g., Mild, Moderate, Severe"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <Input
                          label="Seasonal Pattern"
                          {...register('seasonal_pattern')}
                          error={errors.seasonal_pattern?.message}
                          placeholder="e.g., Winter, All Seasons"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <Input
                          label="Emergency Admission Rate (%)"
                          type="number"
                          {...register('hospital_emergency_admission_rate', { valueAsNumber: true })}
                          error={errors.hospital_emergency_admission_rate?.message}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <Input
                          label="ICU Utilization (%)"
                          type="number"
                          {...register('icu_utilization', { valueAsNumber: true })}
                          error={errors.icu_utilization?.message}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full md:w-auto px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <span>Submit Disease Data</span>
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