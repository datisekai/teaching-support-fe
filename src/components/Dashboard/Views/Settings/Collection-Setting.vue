<template>
  <div class="row">
    <div class="offset-md-2 col-md-8">
      <my-card raised class="form-card">
        <h6 slot="header">{{$t('el.formCardTitle.collectionSetting')}}</h6>
        <el-form :model="formCollectionSetting" label-width="140px" data-vv-scope="formCollectionSetting">
          <el-form-item :label="$t('el.formCard.type')" :required="true">
            <my-select
              class="full-width"
              data-vv-name="type"
              v-validate="'required'"
              v-model="formCollectionSetting.type"
              :attribute="{options: collectionSettingTypeOptions, multiple: false}"
              :placeholder="$t('el.formCard.type')"
              :class="errors.has('type')?'border-danger':''"
              :data-vv-as="$t('el.formCard.type')"
            >
            </my-select>
            <span class="text-danger" v-if="errors.has('formCollectionSetting.type')">{{ errors.first('formCollectionSetting.type') }}</span>
          </el-form-item>

          <el-form-item :required="true" :label="$t('el.formCard.collection')">
            <select-ajax
              data-vv-name="collection"
              v-model="formCollectionSetting.collectionSlug"
              v-validate="'required'"
              :data-vv-as="$t('el.formCard.collection')"
              :class="errors.has('formCollectionSetting.collection')?'border-danger':''"
              :attribute="selectAjaxAttribute"
            ></select-ajax>
            <span class="text-danger" v-if="errors.has('formCollectionSetting.collection')">{{ errors.first('formCollectionSetting.collection') }}</span>
          </el-form-item>
        </el-form>
      </my-card>
    </div>
  </div>
</template>

<script>
import Card from 'src/components/UIComponents/Cards/Card.vue';
import MySelect from "src/components/UIComponents/Select";
import SelectAjax from "src/components/UIComponents/SelectAjax";
import { 
  Form,
  FormItem,
  Select, 
  Option, 
  Button, 
  Input, 
  DatePicker, 
  Radio, 
  RadioGroup, 
  Switch, 
  MessageBox, 
  Notification, 
} from 'element-ui';
import { mapGetters } from 'vuex';

export default {
  components: {
    ElButton: Button,
    ElForm: Form,
    ElFormItem: FormItem,
    SelectAjax,
    MyCard: Card,
    MySelect,
  },
  data() {
    return {
      selectAjaxAttribute: {
        type: 'category', 
        field: 'name', 
        multiple: false,
        valueKey: 'slug',
        key: 'slug',
      },
      collectionSettingTypeOptions: [
        {
          title: 'Best sellers',
          value: 'best-seller'
        },
        {
          title: 'New products',
          value: 'new-product'
        }
      ],
      formCollectionSetting: {
        type: 'best-seller',
        collectionSlug: '',
      },
      collectionSetting: {},
    }
  },
  async mounted() {
    this.$store.dispatch('setCurrentActions', [{
      label: 'update',
      type: 'primary',
      icon: '',
      callback: this.update,
    }]);

    const collectionSetting = await this.$store.dispatch('fetchCollectionSettingMeta');
    this.collectionSetting = collectionSetting;
    this.formCollectionSetting.collectionSlug = this.collectionSetting[this.formCollectionSetting.type];
  },
  methods: {
    async update() {
      const validateRs = await this.$validator.validateAll('formCollectionSetting');
      if (!validateRs) {
        return Notification.error('Validate error');
      }

      try {
        await this.$store.dispatch('updateCollectionSettingMeta', this.formCollectionSetting);
        return Notification.success({
          title: `Update successfully`,
        });
      } catch (error) {
        return Notification.error({
          title: `Update failed`,
          message: error.message,
        });
      }
    }
  },
  watch: {
    'formCollectionSetting.type': function(newVal) {
      if (newVal) {
        this.formCollectionSetting.collectionSlug = this.collectionSetting[newVal];
      }
    },
  }
}
</script>
