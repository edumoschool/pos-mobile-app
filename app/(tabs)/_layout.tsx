import { Platform } from 'react-native';
import { useColor } from '@/hooks/useColor';
import { useTranslation } from 'react-i18next';
import MaterialIcons from '@expo/vector-icons/Feather';
import { NativeTabs } from 'expo-router/unstable-native-tabs';

const { Badge, Icon, Label, VectorIcon } = NativeTabs.Trigger;

export default function TabsLayout() {
  const { t } = useTranslation();
  const red = useColor('red');
  const primary = useColor('primary');
  const foreground = useColor('foreground');

  return (
    <NativeTabs
      minimizeBehavior='onScrollDown'
      labelStyle={{
        default: { color: primary },
        selected: { color: foreground },
      }}
      iconColor={{
        default: primary,
        selected: foreground,
      }}
      badgeBackgroundColor={red}
      labelVisibilityMode='labeled'
      disableTransparentOnScrollEdge={true}
    >
      <NativeTabs.Trigger name='(home)'>
        {Platform.select({
          ios: <Icon sf='house.fill' />,
          android: (
            <Icon src={<VectorIcon family={MaterialIcons} name='home' />} />
          ),
        })}
        <Label>{t('tabs.home')}</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name='products'>
        {Platform.select({
          ios: <Icon sf='archivebox.fill' />,
          android: (
            <Icon src={<VectorIcon family={MaterialIcons} name='package' />} />
          ),
        })}
        <Label>{t('tabs.products')}</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name='settings'>
        {Platform.select({
          ios: <Icon sf='gear' />,
          android: (
            <Icon src={<VectorIcon family={MaterialIcons} name='settings' />} />
          ),
        })}
        <Label>{t('tabs.settings')}</Label>
        </NativeTabs.Trigger>
    </NativeTabs>
  );
}
