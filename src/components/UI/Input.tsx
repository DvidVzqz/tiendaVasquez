
import {
    Controller,
    type Control,
    type FieldValues,
    type RegisterOptions,
} from 'react-hook-form';
import { forwardRef, type FC, type Ref } from 'react';
import type React from 'react';

interface PropsInput extends React.InputHTMLAttributes<HTMLInputElement> {
    ref?: Ref<HTMLInputElement> | undefined;
    label?: string;
    errors?: Record<string, any>;
    name?: string;
    control?: Control<FieldValues, any>;
    rules?: Omit<
        RegisterOptions<any, any>,
        'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
    >;
}

export const Input: FC<PropsInput> = forwardRef(
    (
        {
            label,
            errors = {},
            name = '',
            control,
            rules,
            ...props
        },
        ref,
    ) => {
        const error = errors[name];
        const hasError = !!error;

        return (
            <div className="flex flex-col gap-2">
                {label && <label className="block text-sm font-medium text-gray-300">{label}{rules?.required && ' * '}</label>}
                <Controller
                    control={control}
                    name={name}
                    rules={rules}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <input
                            className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                            // className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                            ref={ref}
                            {...props}
                            onBlur={onBlur}
                            value={String(value ?? '')}
                            onChange={onChange}
                        />
                    )}
                />
                <p>{hasError && error.message}</p>
            </div>
        );
    },
);
