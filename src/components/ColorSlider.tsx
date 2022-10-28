import { useState, useMemo, useCallback, useEffect } from 'react';
import {
    Color,
    colorTest,
    HSLToHEX,
    HSLToString,
    HSL_RANGE,
} from '@vinsjo/color-parser';

import { rand_int } from '@/utils';
import { Slider, SliderProps, useMantineTheme } from '@mantine/core';

type Props = Omit<
    SliderProps,
    'styles' | 'min' | 'max' | 'onChange' | 'value'
> & {
    initialColor?: string;
    lightness?: number;
    saturation?: number;
    onChange?: (color: string) => unknown;
};

const getGradient = (saturation: number, lightness: number) => {
    return ([...Array(HSL_RANGE[0])] as number[]).map((hue) => {
        return HSLToString(hue, saturation, lightness);
    });
};

export default function ColorSlider({
    initialColor,
    saturation,
    lightness,
    onChange,
}: Props) {
    const theme = useMantineTheme();
    const [sat, light] = useMemo(() => {
        return [saturation, lightness].map((v, i) =>
            typeof v !== 'number' ? HSL_RANGE[i + 1] / 2 : v
        );
    }, [saturation, lightness]);

    const gradient = useMemo(() => {
        return getGradient(sat, light);
    }, [sat, light]);

    const styles = useMemo<SliderProps['styles']>(() => {
        return {
            track: {
                background: theme.fn.linearGradient(0, ...gradient),
            },
        };
    }, [theme, gradient]);

    const [hue, setHue] = useState(() => {
        return typeof initialColor !== 'string' || !colorTest(initialColor)
            ? rand_int(HSL_RANGE[0])
            : Color(initialColor).hue;
    });

    const hex = useMemo(() => HSLToHEX(hue, sat, light), [hue, sat, light]);

    const handleChange = useCallback((hue: number) => setHue(hue), []);

    useEffect(() => {
        if (typeof onChange === 'function') onChange(hex);
    }, [onChange, hex]);

    return (
        <Slider
            styles={styles}
            value={hue}
            min={0}
            max={HSL_RANGE[0]}
            onChange={handleChange}
        />
    );
}
