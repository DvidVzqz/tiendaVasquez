import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { useForm, type UseFormProps } from 'react-hook-form';
import { AxiosError, isAxiosError, type AxiosResponse } from 'axios';
import { useGlobalAlerts } from '../contexts/LoadingContext';

export const useFormulario = (
    propsMutate?: UseMutationOptions<AxiosResponse, AxiosError, { [key: string]: any }, unknown>,
    propsForm?: UseFormProps<any, unknown>,
    // mutationFn?: MutationFunction<unknown, unknown>,
) => {
    const { showAlert } = useGlobalAlerts();
    const { setError, handleSubmit, ...form } = useForm(propsForm);
    const { mutate, ...mutation } = useMutation({
        onError: error => {
            console.error({ ...error });
            if (isAxiosError(error)) {
                const errors = error.response?.data as any;
                if ('error' in errors)
                    showAlert(errors.error.toString(), "error");
                else
                    Object.keys(errors ?? {}).forEach(x =>
                        setError(x, { type: 'custom', message: errors[x].toString() }),
                    );
            }
        },
        ...propsMutate,
    });

    return {
        onSubmit: handleSubmit((e: any) => mutate(e)),
        useForm: {
            ...form,
            setError,
            handleSubmit,
        },
        useMutation: {
            mutate,
            ...mutation,
        },
    };
};