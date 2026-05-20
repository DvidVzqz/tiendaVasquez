import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { useForm, type FieldValues, type UseFormProps, type UseFormSetError } from 'react-hook-form';
import { AxiosError, isAxiosError, type AxiosResponse } from 'axios';

export const useFormulario = (
    propsMutate?: UseMutationOptions<AxiosResponse, AxiosError, { [key: string]: any }, unknown>,
    propsForm?: UseFormProps<any, unknown>,
    // mutationFn?: MutationFunction<unknown, unknown>,
) => {
    const { setError, handleSubmit, ...form } = useForm(propsForm);
    const { mutate, ...mutation } = useMutation({
        onError: error => {
            console.error({ ...error });
            if (isAxiosError(error)) {
                const errors = error.response?.data as any;
                if ('error' in errors)
                    console.log(errors);
                // Toast.show({ type: 'error', text1: errors.error.toString() });
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