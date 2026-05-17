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
        default: { color: foreground },
        selected: { color: primary },
      }}
      iconColor={{
        default: foreground,
        selected: primary,
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

      <NativeTabs.Trigger name='sales'>
        {Platform.select({
          ios: <Icon sf='doc.text.fill' />,
          android: (
            <Icon src={<VectorIcon family={MaterialIcons} name='file-text' />} />
          ),
        })}
        <Label>{t('tabs.sales')}</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name='(transactions)'>
        {Platform.select({
          ios: <Icon sf='arrow.left.arrow.right' />,
          android: (
            <Icon src={<VectorIcon family={MaterialIcons} name='repeat' />} />
          ),
        })}
        <Label>{t('tabs.transactions')}</Label>
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
