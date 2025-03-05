const InputField = ({ label, type, name, register, validation, errorMessage, error, placeholder, required }) => {
  return (
    <div className="mb-2">
      <label className="block font-bold">{label}</label>
      <input
        type={type}
        {...register(name, { 
          ...(required
            ? { required: typeof required === "string" ? required : "This field is required" }
            : {}), 
          ...(validation ? { pattern: { value: validation, message: errorMessage } } : {})
        })}
        placeholder={placeholder}
        className="mt-2 p-2 md:p-3 w-full border border-gray rounded-md focus:ring focus:ring-blue-300"
      />
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
};

export default InputField;
