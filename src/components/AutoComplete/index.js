import debounce from 'lodash.debounce'
import PropTypes from 'prop-types'
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  Dimensions,
  Keyboard,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { moderateScale, ScaledSheet } from 'react-native-size-matters'
import { withFadeAnimation } from './HOC/withFadeAnimation'
import { NothingFound } from './NothingFound'
import { RightButton } from './RightButton'
import { ScrollViewListItem } from './ScrollViewListItem'
import { Entypo, Feather } from '@expo/vector-icons'; // eslint-disable-line import/no-extraneous-dependencies

export const AutocompleteDropdown = memo(
  forwardRef((props, ref) => {
    const inputRef = useRef(null)
    const containerRef = useRef(null)
    const [selectedItem, setSelectedItem] = useState(null)
    const [direction, setDirection] = useState(props.direction ?? 'down')
    const [isOpened, setIsOpened] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [dataSet, setDataSet] = useState(props.dataSet)
    const clearOnFocus = props.clearOnFocus === false ? false : true
    const inputHeight = props.inputHeight ?? moderateScale(40, 0.2)
    const suggestionsListMaxHeight =
      props.suggestionsListMaxHeight ?? moderateScale(200, 0.2)
    const bottomOffset = props.bottomOffset ?? 0
    const ScrollViewComponent = props.ScrollViewComponent ?? ScrollView
    const InputComponent = props.InputComponent ?? TextInput

    useLayoutEffect(() => {
      if (ref) {
        if (typeof ref === 'function') {
          ref(inputRef.current)
        } else {
          ref.current = inputRef.current
        }
      }
    }, [inputRef])

    /** Set initial value */
    useEffect(() => {
      if (!Array.isArray(dataSet) || selectedItem) {
        // nothing to set or already setted
        return
      }

      let dataSetItem
      if (typeof props.initialValue === 'string') {
        dataSetItem = dataSet.find((el) => el.id === props.initialValue)
      } else if (
        typeof props.initialValue === 'object' &&
        props.initialValue.id
      ) {
        dataSetItem = dataSet.find((el) => el.id === props.initialValue.id)
      }

      if (dataSetItem) {
        setSelectedItem(dataSetItem)
      }
    }, [])

    /** expose controller methods */
    useEffect(() => {
      if (typeof props.controller === 'function') {
        props.controller({ close, open, toggle, clear, setInputText })
      }
    }, [isOpened, props.controller])

    useEffect(() => {
      setDataSet(props.dataSet)
    }, [props.dataSet])

    useEffect(() => {
      if (selectedItem) {
        setSearchText(selectedItem.title ?? '')
      } else {
        setSearchText('')
      }

      if (typeof props.onSelectItem === 'function') {
        props.onSelectItem(selectedItem)
      }
    }, [selectedItem])

    useEffect(() => {
      if (typeof props.onOpenSuggestionsList === 'function') {
        props.onOpenSuggestionsList(isOpened)
      }
      // renew state on close
      if (!isOpened) {
        if (selectedItem && props.resetOnClose !== false) {
          setSearchText(selectedItem.title)
        }
      }
    }, [isOpened])

    /**
     * For re-render list while typing and useFilter
     */
    useEffect(() => {
      if (props.useFilter !== false && Array.isArray(props.dataSet)) {
        setDataSet(props.dataSet.slice())
      }
    }, [searchText])

    const _onSelectItem = useCallback((item) => {
      setSelectedItem(item)

      inputRef.current.blur()
      setIsOpened(false)
    }, [])

    const calculateDirection = async () => {
      const [, positionY] = await new Promise((resolve) =>
        containerRef.current.measureInWindow((...rect) => {
          resolve(rect)
        })
      )

      const screenHeight = Dimensions.get('window').height

      const lowestPointOfDropdown =
        positionY + inputHeight + suggestionsListMaxHeight + bottomOffset

      const direction = lowestPointOfDropdown < screenHeight ? 'down' : 'up'
      setDirection(direction)
    }

    /** methods */
    const close = () => {
      setIsOpened(false)
    }

    const open = async () => {
      if (!props.direction) {
        await calculateDirection()
      }

      setIsOpened(true)
    }

    const toggle = () => {
      isOpened ? close() : open()
    }

    const clear = () => {
      onClearPress()
    }

    const setInputText = (text) => {
      setSearchText(text)
    }

    const ItemSeparatorComponent = props.ItemSeparatorComponent ?? (
      <View></View>
    )

    const renderItem = useCallback(
      (item, searchText) => {
        if (typeof props.renderItem === 'function') {
          const LI = props.renderItem(item, searchText)
          return (
            <TouchableOpacity onPress={() => _onSelectItem(item)}>
              {LI}
            </TouchableOpacity>
          )
        }
        let titleHighlighted = ''
        let titleStart = item.title
        let titleEnd = ''
        if (
          typeof item.title === 'string' &&
          item.title.length > 0 &&
          searchText.length > 0
        ) {
          const substrIndex = item.title
            .toLowerCase()
            .indexOf(searchText.toLowerCase())
          if (substrIndex !== -1) {
            titleStart = item.title.slice(0, substrIndex)
            titleHighlighted = item.title.slice(
              substrIndex,
              substrIndex + searchText.length
            )
            titleEnd = item.title.slice(substrIndex + searchText.length)
          } else {
            if (props.useFilter !== false) {
              return null
            }
          }
        }

        const EL = withFadeAnimation(
          () => (
            <ScrollViewListItem
              {...{ titleHighlighted, titleStart, titleEnd }}
              onPress={() => _onSelectItem(item)}
            ></ScrollViewListItem>
          ),
          {}
        )
        return <EL></EL>
      },
      [props.renderItem]
    )

    const scrollContent = useMemo(() => {
      if (!Array.isArray(dataSet)) {
        return null
      }

      const content = []
      const itemsCount = dataSet.length - 1
      dataSet.forEach((item, i) => {
        const listItem = renderItem(item, searchText)
        if (listItem) {
          content.push(
            <View key={item.id}>
              {listItem}
              {i < itemsCount && ItemSeparatorComponent}
            </View>
          )
        }
      })
      return content
    }, [dataSet]) // don't use searchText here because it will rerender list twice every time

    const onClearPress = useCallback(() => {
      setSearchText('')
      setSelectedItem(null)
      setIsOpened(false)
      inputRef.current.blur()
      if (typeof props.onClear === 'function') {
        props.onClear()
      }
    }, [props.onClear])

    const debouncedEvent = useCallback(
      debounce((text) => {
        if (typeof props.onChangeText === 'function') {
          props.onChangeText(text)
        }
      }, props.debounce ?? 0),
      [props.onChangeText]
    )

    const onChangeText = useCallback((text) => {
      setSearchText(text)
      debouncedEvent(text)
    }, [])

    const onChevronPress = useCallback(() => {
      toggle()
      Keyboard.dismiss()
    }, [isOpened])

    const onFocus = useCallback(
      (e) => {
        if (clearOnFocus) {
          setSearchText('')
        }
        if (typeof props.onFocus === 'function') {
          props.onFocus(e)
        }
        open()
      },
      [dataSet, clearOnFocus, props.onFocus]
    )

    const onBlur = useCallback((e) => {
      if (props.closeOnBlur) {
        close()
      }
      if (typeof props.onBlur === 'function') {
        props.onBlur(e)
      }
    }, [props.closeOnBlur, props.onBlur])

    const onSubmit = useCallback(
      (e) => {
        inputRef.current.blur()
        if (props.closeOnSubmit) {
          close()
        }

        if (typeof props.onSubmit === 'function') {
          props.onSubmit(e)
        }
      },
      [props.closeOnSubmit, props.onSubmit]
    )


    return (
      <View
        style={[
          styles.container,
          props.containerStyle,
          Platform.select({ ios: { zIndex: 1 } }),
        ]}
      >
        {/* it's necessary use onLayout here for Androd (bug?) */}
        <View  style = {styles.borderWrap}>

          <View style={styles.searchInputContainer}>
          <View style={styles.iconPadding}>
            <Feather name="search" size={20} />
          </View>

          <TextInput
            ref={inputRef}
            value={searchText}
            onChangeText={onChangeText}
            autoCorrect={false}
            onBlur={onBlur}
            onFocus={onFocus}
            onSubmitEditing={onSubmit}
            placeholderTextColor="#d0d4dc"
            styles={styles.textInput}
          />
        <View
          ref={containerRef}
          onLayout={(_) => {}}
          style={[props.inputContainerStyle]}
        >

          </View>

          <RightButton
            isOpened={isOpened}
            inputHeight={inputHeight}
            onClearPress={onClearPress}
            onChevronPress={onChevronPress}
            showChevron={props.showChevron ?? false}
            showClear={props.showClear ?? !!searchText}
            loading={props.loading}
            buttonsContainerStyle={props.rightButtonsContainerStyle}
            ChevronIconComponent={props.ChevronIconComponent}
            ClearIconComponent={props.ClearIconComponent}
          ></RightButton>
        </View>
       </View>




        {(searchText.length!=0) && Array.isArray(dataSet) && (
          <View
            style={{
              ...styles.listContainer,
              [direction === 'down' ? 'top' : 'bottom']: inputHeight + 5,
              ...props.suggestionsListContainerStyle,
            }}
          >
            <ScrollViewComponent
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="handled"
              style={{ maxHeight: suggestionsListMaxHeight }}
              nestedScrollEnabled={true}
              onScrollBeginDrag={Keyboard.dismiss}
            >
              {
                <View>
                  {scrollContent.length > 0
                    ? scrollContent
                    : !!searchText && <NothingFound emptyResultText={props.emptyResultText} />}
                </View>
              }
            </ScrollViewComponent>
          </View>
        )}
      </View>
    )
  })
)

AutocompleteDropdown.propTypes = {
  dataSet: PropTypes.array,
  initialValue: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  loading: PropTypes.bool,
  useFilter: PropTypes.bool,
  showClear: PropTypes.bool,
  showChevron: PropTypes.bool,
  closeOnBlur: PropTypes.bool,
  closeOnSubmit: PropTypes.bool,
  clearOnFocus: PropTypes.bool,
  resetOnClose: PropTypes.bool,
  debounce: PropTypes.number,
  suggestionsListMaxHeight: PropTypes.number,
  bottomOffset: PropTypes.number,
  onChangeText: PropTypes.func,
  onSelectItem: PropTypes.func,
  onOpenSuggestionsList: PropTypes.func,
  onClear: PropTypes.func,
  onSubmit: PropTypes.func,
  onBlur: PropTypes.func,
  controller: PropTypes.func,
  containerStyle: PropTypes.object,
  rightButtonsContainerStyle: PropTypes.object,
  suggestionsListContainerStyle: PropTypes.object,
  ChevronIconComponent: PropTypes.element,
  ClearIconComponent: PropTypes.element,
  ScrollViewComponent: PropTypes.elementType,
  emptyResultText: PropTypes.string
}

const styles = ScaledSheet.create({
  textInput:{
    width:'100%',
    height:'100%',
    padding: 8,  },
  container: {
    marginVertical: 2,
  },
  Input: {
    width: '100%',
    borderRadius: 5,
    overflow: 'hidden',
    paddingHorizontal: 13,
    width:'100%',
    zIndex:100,
    margin:5,
  },

  listContainer: {
    backgroundColor: '#fff',
    position: 'absolute',
    width: '85%',
    zIndex: 10,
    borderRadius: 5,
    borderWidth:0.5,
    borderColor:"#000",
    shadowColor: '#00000099',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    marginVertical:-5,
    padding:5,
    marginHorizontal:5,
    elevation: 10,
  },

  borderWrap:{
    alignItems: 'center',
    marginVertical: 5,
    flexDirection: 'row',
  },
  iconPadding: {
    padding: 3,
  },
  searchInputContainer: {
    height: 36,
    width: '85%',
    borderRadius: 10,
    borderWidth: 0.5,
    paddingHorizontal: 5,
    paddingVertical: 2,
    flexDirection: 'row',
    marginLeft: 5,
    marginRight:3,
  }

})
