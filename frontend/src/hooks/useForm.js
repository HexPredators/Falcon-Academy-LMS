import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';

export const useForm = (initialValues = {}, options = {}) => {
  const { t } = useTranslation();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  const formRef = useRef(null);

  const {
    validateOnChange = true,
    validateOnBlur = true,
    validateOnMount = false,
    validationSchema,
    onSubmit,
    onSuccess,
    onError
  } = options;

  const validateField = useCallback(async (fieldName, value) => {
    if (!validationSchema) return null;

    try {
      if (typeof validationSchema === 'function') {
        const schema = validationSchema(t);
        await schema.validateAt(fieldName, { [fieldName]: value });
        return null;
      } else if (validationSchema[fieldName]) {
        const validator = validationSchema[fieldName];
        
        if (typeof validator === 'function') {
          const error = await validator(value, values);
          return error;
        } else if (validator.test) {
          if (!validator.test.test(value)) {
            return validator.message || t('validation.invalid');
          }
          return null;
        }
      }
      
      return null;
    } catch (error) {
      return error.message;
    }
  }, [validationSchema, values, t]);

  const validateForm = useCallback(async () => {
    if (!validationSchema) return {};

    const newErrors = {};
    
    try {
      if (typeof validationSchema === 'function') {
        const schema = validationSchema(t);
        await schema.validate(values, { abortEarly: false });
      } else {
        for (const [fieldName, validator] of Object.entries(validationSchema)) {
          const error = await validateField(fieldName, values[fieldName]);
          if (error) {
            newErrors[fieldName] = error;
          }
        }
      }
    } catch (error) {
      if (error.inner) {
        error.inner.forEach(err => {
          newErrors[err.path] = err.message;
        });
      } else {
        console.error('Validation error:', error);
      }
    }

    return newErrors;
  }, [values, validationSchema, validateField, t]);

  const handleChange = useCallback((field, value) => {
    const fieldName = field.target?.name || field;
    const fieldValue = field.target?.value ?? value;

    setValues(prev => ({
      ...prev,
      [fieldName]: fieldValue
    }));

    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }));

    if (validateOnChange) {
      validateField(fieldName, fieldValue).then(error => {
        setErrors(prev => ({
          ...prev,
          [fieldName]: error || undefined
        }));
      });
    }
  }, [validateField, validateOnChange]);

  const handleBlur = useCallback((field) => {
    const fieldName = field.target?.name || field;

    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }));

    if (validateOnBlur) {
      validateField(fieldName, values[fieldName]).then(error => {
        setErrors(prev => ({
          ...prev,
          [fieldName]: error || undefined
        }));
      });
    }
  }, [values, validateField, validateOnBlur]);

  const setFieldValue = useCallback((fieldName, value) => {
    handleChange(fieldName, value);
  }, [handleChange]);

  const setFieldError = useCallback((fieldName, error) => {
    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
  }, []);

  const setFieldTouched = useCallback((fieldName, isTouched = true) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: isTouched
    }));
  }, []);

  const resetForm = useCallback((newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setSubmitCount(0);
  }, [initialValues]);

  const handleSubmit = useCallback(async (event) => {
    if (event) {
      event.preventDefault();
      event.persist();
    }

    setIsSubmitting(true);
    setSubmitCount(prev => prev + 1);

    try {
      const formErrors = await validateForm();
      setErrors(formErrors);

      if (Object.keys(formErrors).length === 0) {
        if (onSubmit) {
          await onSubmit(values, {
            resetForm,
            setErrors,
            setSubmitting: setIsSubmitting,
            setValues
          });
        }
        
        onSuccess?.(values);
        
        if (options.showSuccessToast) {
          toast.success(options.successMessage || t('form.submit_success'));
        }
      } else {
        if (options.showErrorToast) {
          toast.error(options.errorMessage || t('form.validation_error'));
        }
        onError?.(formErrors);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors(prev => ({
        ...prev,
        _form: error.message || t('form.submit_error')
      }));
      
      if (options.showErrorToast) {
        toast.error(error.message || t('form.submit_error'));
      }
      onError?.(error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateForm, onSubmit, resetForm, onSuccess, onError, options, t]);

  useEffect(() => {
    if (validateOnMount) {
      validateForm().then(formErrors => {
        setErrors(formErrors);
      });
    }
  }, [validateOnMount, validateForm]);

  useEffect(() => {
    validateForm().then(formErrors => {
      const hasErrors = Object.keys(formErrors).length > 0;
      setIsValid(!hasErrors);
    });
  }, [values, validateForm]);

  const getFieldProps = useCallback((fieldName, props = {}) => {
    return {
      name: fieldName,
      value: values[fieldName] ?? '',
      onChange: (e) => handleChange(fieldName, e.target.value),
      onBlur: (e) => handleBlur(fieldName),
      error: errors[fieldName],
      touched: touched[fieldName],
      ...props
    };
  }, [values, errors, touched, handleChange, handleBlur]);

  const getInputProps = useCallback((fieldName, props = {}) => {
    const fieldProps = getFieldProps(fieldName, props);
    
    return {
      ...fieldProps,
      className: `w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
        errors[fieldName] && touched[fieldName]
          ? 'border-red-500'
          : 'border-gray-300'
      } ${props.className || ''}`,
      'aria-invalid': errors[fieldName] ? 'true' : 'false',
      'aria-describedby': errors[fieldName] ? `${fieldName}-error` : undefined
    };
  }, [getFieldProps, errors, touched]);

  const getSelectProps = useCallback((fieldName, props = {}) => {
    const fieldProps = getFieldProps(fieldName, props);
    
    return {
      ...fieldProps,
      className: `w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
        errors[fieldName] && touched[fieldName]
          ? 'border-red-500'
          : 'border-gray-300'
      } ${props.className || ''}`,
      'aria-invalid': errors[fieldName] ? 'true' : 'false',
      'aria-describedby': errors[fieldName] ? `${fieldName}-error` : undefined
    };
  }, [getFieldProps, errors, touched]);

  const getCheckboxProps = useCallback((fieldName, props = {}) => {
    return {
      name: fieldName,
      checked: Boolean(values[fieldName]),
      onChange: (e) => handleChange(fieldName, e.target.checked),
      onBlur: () => handleBlur(fieldName),
      'aria-invalid': errors[fieldName] ? 'true' : 'false',
      'aria-describedby': errors[fieldName] ? `${fieldName}-error` : undefined,
      ...props
    };
  }, [values, errors, handleChange, handleBlur]);

  const getRadioProps = useCallback((fieldName, value, props = {}) => {
    return {
      name: fieldName,
      value,
      checked: values[fieldName] === value,
      onChange: () => handleChange(fieldName, value),
      onBlur: () => handleBlur(fieldName),
      'aria-invalid': errors[fieldName] ? 'true' : false,
      'aria-describedby': errors[fieldName] ? `${fieldName}-error` : undefined,
      ...props
    };
  }, [values, errors, handleChange, handleBlur]);

  const getTextareaProps = useCallback((fieldName, props = {}) => {
    const fieldProps = getFieldProps(fieldName, props);
    
    return {
      ...fieldProps,
      className: `w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
        errors[fieldName] && touched[fieldName]
          ? 'border-red-500'
          : 'border-gray-300'
      } ${props.className || ''}`,
      rows: props.rows || 3,
      'aria-invalid': errors[fieldName] ? 'true' : 'false',
      'aria-describedby': errors[fieldName] ? `${fieldName}-error` : undefined
    };
  }, [getFieldProps, errors, touched]);

  const getFormProps = useCallback((props = {}) => {
    return {
      ref: formRef,
      onSubmit: handleSubmit,
      noValidate: true,
      ...props
    };
  }, [handleSubmit]);

  const getErrorProps = useCallback((fieldName) => {
    return {
      id: `${fieldName}-error`,
      className: 'mt-2 text-sm text-red-600 flex items-center',
      role: 'alert'
    };
  }, []);

  const hasErrors = Object.keys(errors).length > 0;
  const isTouched = Object.keys(touched).length > 0;
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,
    hasErrors,
    isTouched,
    submitCount,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    resetForm,
    validateField,
    validateForm,
    getFieldProps,
    getInputProps,
    getSelectProps,
    getCheckboxProps,
    getRadioProps,
    getTextareaProps,
    getFormProps,
    getErrorProps,
    setValues,
    setErrors,
    setTouched
  };
};

export const useDynamicForm = (initialFields = [], options = {}) => {
  const { t } = useTranslation();
  const [fields, setFields] = useState(initialFields);
  const [values, setValues] = useState(() => {
    const initialValues = {};
    initialFields.forEach(field => {
      initialValues[field.name] = field.initialValue || '';
    });
    return initialValues;
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const addField = useCallback((field) => {
    setFields(prev => [...prev, field]);
    setValues(prev => ({
      ...prev,
      [field.name]: field.initialValue || ''
    }));
  }, []);

  const removeField = useCallback((fieldName) => {
    setFields(prev => prev.filter(field => field.name !== fieldName));
    setValues(prev => {
      const newValues = { ...prev };
      delete newValues[fieldName];
      return newValues;
    });
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
    setTouched(prev => {
      const newTouched = { ...prev };
      delete newTouched[fieldName];
      return newTouched;
    });
  }, []);

  const updateField = useCallback((fieldName, updates) => {
    setFields(prev => prev.map(field => 
      field.name === fieldName ? { ...field, ...updates } : field
    ));
  }, []);

  const moveField = useCallback((fromIndex, toIndex) => {
    setFields(prev => {
      const newFields = [...prev];
      const [movedField] = newFields.splice(fromIndex, 1);
      newFields.splice(toIndex, 0, movedField);
      return newFields;
    });
  }, []);

  const validateField = useCallback(async (fieldName, value) => {
    const field = fields.find(f => f.name === fieldName);
    if (!field?.validation) return null;

    try {
      const error = await field.validation(value, values);
      return error;
    } catch (error) {
      return error.message;
    }
  }, [fields, values]);

  const handleFieldChange = useCallback((fieldName, value) => {
    setValues(prev => ({
      ...prev,
      [fieldName]: value
    }));

    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }));

    if (options.validateOnChange) {
      validateField(fieldName, value).then(error => {
        setErrors(prev => ({
          ...prev,
          [fieldName]: error || undefined
        }));
      });
    }
  }, [options.validateOnChange, validateField]);

  const handleFieldBlur = useCallback((fieldName) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }));

    if (options.validateOnBlur) {
      validateField(fieldName, values[fieldName]).then(error => {
        setErrors(prev => ({
          ...prev,
          [fieldName]: error || undefined
        }));
      });
    }
  }, [options.validateOnBlur, validateField, values]);

  const getFieldProps = useCallback((fieldName) => {
    const field = fields.find(f => f.name === fieldName);
    if (!field) return null;

    return {
      ...field,
      value: values[fieldName] ?? '',
      onChange: (value) => handleFieldChange(fieldName, value),
      onBlur: () => handleFieldBlur(fieldName),
      error: errors[fieldName],
      touched: touched[fieldName],
      disabled: field.disabled || options.isSubmitting
    };
  }, [fields, values, errors, touched, handleFieldChange, handleFieldBlur, options.isSubmitting]);

  const validateForm = useCallback(async () => {
    const newErrors = {};
    
    for (const field of fields) {
      if (field.validation) {
        const error = await validateField(field.name, values[field.name]);
        if (error) {
          newErrors[field.name] = error;
        }
      }
    }

    return newErrors;
  }, [fields, values, validateField]);

  const resetForm = useCallback(() => {
    const initialValues = {};
    fields.forEach(field => {
      initialValues[field.name] = field.initialValue || '';
    });
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [fields]);

  return {
    fields,
    values,
    errors,
    touched,
    addField,
    removeField,
    updateField,
    moveField,
    getFieldProps,
    handleFieldChange,
    handleFieldBlur,
    validateForm,
    resetForm,
    setValues,
    setErrors,
    setTouched
  };
};

export const useMultiStepForm = (steps = [], options = {}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepData, setStepData] = useState(() => {
    const data = {};
    steps.forEach((_, index) => {
      data[index] = {};
    });
    return data;
  });

  const totalSteps = steps.length;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const currentStepConfig = steps[currentStep];

  const nextStep = useCallback(async () => {
    if (isLastStep) return;

    if (currentStepConfig?.validate) {
      const isValid = await currentStepConfig.validate(stepData[currentStep]);
      if (!isValid) return;
    }

    setCompletedSteps(prev => new Set([...prev, currentStep]));
    setCurrentStep(prev => prev + 1);
  }, [currentStep, currentStepConfig, isLastStep, stepData]);

  const prevStep = useCallback(() => {
    if (isFirstStep) return;
    setCurrentStep(prev => prev - 1);
  }, [isFirstStep]);

  const goToStep = useCallback((stepIndex) => {
    if (stepIndex < 0 || stepIndex >= totalSteps) return;
    if (stepIndex > currentStep && !completedSteps.has(stepIndex - 1)) return;
    setCurrentStep(stepIndex);
  }, [totalSteps, currentStep, completedSteps]);

  const updateStepData = useCallback((data, stepIndex = currentStep) => {
    setStepData(prev => ({
      ...prev,
      [stepIndex]: { ...prev[stepIndex], ...data }
    }));
  }, [currentStep]);

  const submitForm = useCallback(async () => {
    if (!isLastStep) return;

    setIsSubmitting(true);
    
    try {
      const allData = Object.values(stepData).reduce((acc, step) => ({
        ...acc,
        ...step
      }), {});

      if (options.onSubmit) {
        await options.onSubmit(allData);
      }

      if (options.onComplete) {
        options.onComplete();
      }
    } catch (error) {
      console.error('Multi-step form submission error:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [isLastStep, stepData, options]);

  const resetForm = useCallback(() => {
    setCurrentStep(0);
    setCompletedSteps(new Set());
    setStepData({});
    setIsSubmitting(false);
  }, []);

  const getProgress = useCallback(() => {
    const completed = completedSteps.size;
    const total = totalSteps - 1;
    return total > 0 ? (completed / total) * 100 : 0;
  }, [completedSteps, totalSteps]);

  const isStepCompleted = useCallback((stepIndex) => {
    return completedSteps.has(stepIndex);
  }, [completedSteps]);

  const canGoToStep = useCallback((stepIndex) => {
    if (stepIndex === currentStep) return true;
    if (stepIndex < currentStep) return true;
    
    for (let i = currentStep; i < stepIndex; i++) {
      if (!completedSteps.has(i)) return false;
    }
    
    return true;
  }, [currentStep, completedSteps]);

  return {
    currentStep,
    totalSteps,
    isFirstStep,
    isLastStep,
    currentStepConfig,
    stepData,
    isSubmitting,
    completedSteps,
    nextStep,
    prevStep,
    goToStep,
    updateStepData,
    submitForm,
    resetForm,
    getProgress,
    isStepCompleted,
    canGoToStep
  };
};