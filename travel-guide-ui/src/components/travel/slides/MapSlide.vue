<template>
  <section class="section map-section">
    <!-- 区域1：地图导航总控区 -->
    <div id="map-guide-area-control" class="guide-module guide-module-expanded">
      <div class="guide-module-header guide-module-header-static">
        <h2 class="guide-module-title guide-module-title-large">地图导航</h2>
      </div>
      <div class="guide-module-content-wrapper">
        <div class="map-search-bar">
          <div class="map-search-input-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="map-search-icon">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              ref="searchInput"
              v-model="searchKeyword"
              type="text"
              placeholder="搜索地点、景点、美食..."
              class="map-search-input"
              aria-label="搜索地点、景点、美食"
              @keyup.enter="handleSearch"
              @input="handleSearchInput"
            >
            <Transition name="fade">
              <button v-if="searchKeyword" class="map-search-clear" @click="clearSearch" aria-label="清除">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </Transition>
          </div>
          <button class="map-search-btn" @click="handleSearch" :disabled="!searchKeyword">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="map-search-btn-icon">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <span class="map-search-btn-text">搜索</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 区域2：核心地图展示区 -->
    <div id="map-guide-area-map" class="guide-module guide-module-expanded">
      <div class="guide-module-header guide-module-header-static">
        <h3 class="guide-module-title">地图展示</h3>
      </div>
      <div class="guide-module-content-wrapper">
        <div class="map-preview-card">
          <div class="map-preview-container map-container-main" ref="mapContainer" @touchstart.stop @touchend.stop @touchmove.stop>
            <div id="amap-container"></div>
            <div v-if="mapLoading || mapLoadError" class="map-loading">
              <template v-if="mapLoadError">
                <div class="map-loading-error-icon">⚠️</div>
                <span class="map-loading-error-text">{{ locatingStatus }}</span>
                <button class="map-loading-retry-btn" @click="retryMapLoad">
                  {{ mapLoadRetryCount >= 3 ? '刷新页面' : '重新加载' }}
                </button>
              </template>
              <template v-else>
                <div class="map-loading-spinner"></div>
                <span>{{ locatingStatus || '地图加载中...' }}</span>
              </template>
            </div>

            <div class="map-locating-overlay" v-if="isLocating && !mapLoading">
              <div class="map-locating-content">
                <div class="map-locating-spinner"></div>
                <span>正在获取当前位置...</span>
              </div>
            </div>

            <div class="map-gesture-tip" v-if="!mapLoading && showGestureTip">
              <div class="map-gesture-tip-content">
                <div class="map-gesture-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                  </svg>
                  <span>双指缩放</span>
                </div>
                <div class="map-gesture-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="12" cy="12" r="9"/>
                    <path d="M12 8v4l2 2"/>
                  </svg>
                  <span>双指旋转</span>
                </div>
              </div>
              <button class="map-gesture-close" @click="dismissGestureTip">知道了</button>
            </div>
          </div>
          <button class="map-expand-btn map-btn-fullscreen" @click="openFullscreen" aria-label="放大地图">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
            </svg>
            <span>全屏查看</span>
          </button>
          <div class="map-results map-search-results" v-if="searchResults.length > 0">
            <div class="map-results-header">
              <span class="map-results-title">搜索结果</span>
              <button class="map-results-close" @click="searchResults = []" aria-label="关闭">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div class="map-results-list">
              <div
                v-for="(item, index) in searchResults"
                :key="item.id"
                class="map-result-item"
              >
                <div class="map-result-main" role="button" tabindex="0" :aria-label="'选择地点: ' + item.name" @click="selectResult(item)" @keydown.enter="selectResult(item)" @keydown.space.prevent="selectResult(item)">
                  <div class="map-result-index">{{ index + 1 }}</div>
                  <div class="map-result-info">
                    <div class="map-result-name">{{ item.name }}</div>
                    <div class="map-result-address">{{ item.address || item.district }}</div>
                  </div>
                </div>
                <button class="map-result-nav-btn map-btn-result-nav" @click.stop="openRoutePanel(item)" aria-label="导航到这里">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 区域3：地图核心功能操作区 -->
    <div id="map-guide-area-toolbar" class="guide-module guide-module-expanded">
      <div class="guide-module-header guide-module-header-static">
        <h3 class="guide-module-title">功能操作</h3>
      </div>
      <div class="guide-module-content-wrapper">
        <div class="map-actions map-toolbar">
          <button class="map-action-btn map-btn-refresh-location" @click="refreshLocation" aria-label="刷新位置">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 2v4m0 12v4M2 12h4m12 0h4"/>
            </svg>
            <span>刷新位置</span>
          </button>
          <button class="map-action-btn map-btn-plan-route" @click="openRoutePanelFromButton" :disabled="!routeDestination" aria-label="路线">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/>
            </svg>
            <span>路线</span>
          </button>
          <button class="map-action-btn danger map-btn-clear-route" @click="clearRoute" :disabled="!hasRoute" aria-label="清除路线">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
            <span>清除路线</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 区域4：路线状态提示区 -->
    <div id="map-guide-area-status" class="guide-module guide-module-expanded" v-if="hasRoute">
      <div class="guide-module-header guide-module-header-static">
        <h3 class="guide-module-title">路线状态</h3>
      </div>
      <div class="guide-module-content-wrapper">
        <div class="map-route-status map-route-status-bar">
          <span class="map-route-status-icon">💡</span>
          <span class="map-route-status-text">路线已保存，页面可见时自动刷新位置</span>
        </div>
      </div>
    </div>

    <!-- 区域5：目的地快捷选择区 -->
    <div id="map-guide-area-quick" class="guide-module guide-module-expanded">
      <div class="guide-module-header guide-module-header-static">
        <h3 class="guide-module-title">快捷地点</h3>
      </div>
      <div class="guide-module-content-wrapper">
        <div class="map-quick-locations">
          <div class="map-quick-title">
            <span>距您当前位置</span>
            <span v-if="currentPosition" class="map-quick-distance-hint">{{ getDistanceHint() }}</span>
          </div>
          <div class="map-quick-list" v-for="(locs, category) in quickLocations" :key="category">
            <div class="map-quick-category map-quick-category-label">{{ category }}</div>
            <button
              v-for="loc in locs"
              :key="loc.name"
              :class="['map-quick-item', 'map-quick-location-btn', { 'map-quick-item-selected': selectedQuickLocation === loc.name }]"
              @click="goToLocation(loc)"
            >
              <span class="map-quick-emoji">{{ loc.emoji }}</span>
              <span class="map-quick-name">{{ loc.name }}</span>
              <span v-if="currentPosition" class="map-quick-distance">{{ getDistanceToLocation(loc.lnglat) }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 区域6：地图使用提示区 -->
    <div id="map-guide-area-tips" class="guide-module guide-module-expanded">
      <div class="guide-module-header guide-module-header-static">
        <h3 class="guide-module-title">使用提示</h3>
      </div>
      <div class="guide-module-content-wrapper">
        <div class="map-tips map-tips-card">
          <div class="map-tip-content">
            <p>选择地点后点击「路线」按钮可规划导航路线</p>
            <p>点击「全屏查看」可展开完整地图</p>
            <p>点击「刷新位置」可更新当前位置并居中显示</p>
          </div>
        </div>
      </div>
    </div>

<Teleport to="body">
      <Transition name="fullscreen">
        <div v-if="isFullscreen" class="map-modal-overlay" @click.self="closeFullscreen">
          <div class="map-modal-container">
            <div class="map-modal-header">
              <span class="map-modal-title">地图导航</span>
              <button class="map-modal-close" @click="closeFullscreen" aria-label="关闭全屏地图">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
                <span class="map-modal-close-text">关闭</span>
              </button>
            </div>

            <div class="map-modal-content" ref="fullscreenMapContainer">
              <div id="amap-fullscreen-container"></div>

              <div class="map-modal-search-bar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="map-modal-search-icon">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
                <input
                  v-model="fullscreenSearchKeyword"
                  type="text"
                  placeholder="搜索地点..."
                  class="map-modal-search-input"
                  aria-label="搜索地点"
                  @keyup.enter="handleFullscreenSearch"
                  @input="handleFullscreenSearchInput"
                >
                <Transition name="fade">
                  <button v-if="fullscreenSearchKeyword" class="map-modal-search-clear" @click="clearFullscreenSearch" aria-label="清除">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                  </button>
                </Transition>
                <button class="map-modal-search-btn" @click="handleFullscreenSearch" :disabled="!fullscreenSearchKeyword">
                  搜索
                </button>
              </div>

              <div class="map-modal-results" v-if="fullscreenSearchResults.length > 0">
                <div class="map-modal-results-header">
                  <span>搜索结果</span>
                  <button class="map-modal-results-close" @click="fullscreenSearchResults = []">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
                <div class="map-modal-results-list">
                  <div
                    v-for="(item, index) in fullscreenSearchResults"
                    :key="item.id"
                    class="map-modal-result-item"
                    @click="selectFullscreenResult(item)"
                  >
                    <span class="map-modal-result-index">{{ index + 1 }}</span>
                    <div class="map-modal-result-info">
                      <div class="map-modal-result-name">{{ item.name }}</div>
                      <div class="map-modal-result-address">{{ item.address || item.district }}</div>
                    </div>
                    <button class="map-modal-result-nav" @click.stop="openRoutePanel(item)">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div class="map-modal-actions">
                <button @click="fullscreenLocateMe" class="map-modal-action-btn" :class="{ 'is-locating': isFullscreenLocating }" :disabled="isFullscreenLocating">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :class="{ 'locating-spin': isFullscreenLocating }">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 2v4m0 12v4M2 12h4m12 0h4"/>
                  </svg>
                  <span>{{ isFullscreenLocating ? '定位中' : '定位' }}</span>
                </button>
                <button @click="fullscreenReset" class="map-modal-action-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 12a9 9 0 1018 0 9 9 0 00-18 0z"/>
                    <path d="M12 8v4l2 2"/>
                  </svg>
                  <span>重置</span>
                </button>
              </div>

              <div class="map-modal-locating" v-if="isFullscreenLocating">
                <div class="map-locating-content">
                  <div class="map-locating-spinner"></div>
                  <span>正在定位...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="route-panel">
        <div v-if="showRoutePanel" class="route-panel-overlay" @click.self="closeRoutePanel">
          <div class="route-panel">
            <div class="route-panel-header">
              <span class="route-panel-title">路线规划</span>
              <button class="route-panel-close" @click="closeRoutePanel" aria-label="关闭">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div class="route-info">
              <div class="route-endpoints">
                <div class="route-endpoint">
                  <span class="route-endpoint-dot start"></span>
                  <span class="route-endpoint-text">我的位置</span>
                </div>
                <div class="route-endpoint-line"></div>
                <div class="route-endpoint">
                  <span class="route-endpoint-dot end"></span>
                  <span class="route-endpoint-text">{{ routeDestination?.name }}</span>
                </div>
              </div>
            </div>

            <div class="route-modes">
              <button
                v-for="mode in routeModes"
                :key="mode.value"
                :class="['route-mode-btn', { active: selectedRouteMode === mode.value }]"
                @click="changeRouteMode(mode.value)"
              >
                <span class="route-mode-icon">{{ mode.icon }}</span>
                <span class="route-mode-label">{{ mode.label }}</span>
              </button>
            </div>

            <div class="route-result" v-if="routeResult">
              <div class="route-summary">
                <div class="route-distance">{{ routeResult.distance }}</div>
                <div class="route-time">{{ routeResult.time }}</div>
              </div>
              <div class="route-detail" v-if="routeResult.tolls">
                <span>途经高速</span>
                <span>{{ routeResult.tolls }}</span>
              </div>
            </div>

            <div class="route-loading" v-else-if="isRouteLoading">
              <div class="route-loading-spinner"></div>
              <span>正在规划路线...</span>
            </div>

            <div class="route-error" v-else-if="routeError">
              {{ routeError }}
            </div>

            <div class="route-actions">
              <button class="route-action-btn primary" @click="openAmapApp" :disabled="!routeResult">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/>
                </svg>
                <span>前往高德地图</span>
              </button>
              <button class="route-action-btn" @click="showRouteOnMap" :disabled="!routeResult">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span>地图显示路线</span>
              </button>
            </div>

            <div class="route-tip">
              「前往高德地图」可调起手机App导航，「地图显示路线」在当前页面显示
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="detail-panel">
        <div v-if="showDetailPanel" class="detail-panel-overlay" @click.self="closeDetailPanel">
          <div class="detail-panel">
            <div class="detail-panel-header" v-if="selectedPlaceDetail">
              <img
                v-if="selectedPlaceDetail.photos?.[0]?.url"
                :src="selectedPlaceDetail.photos[0].url"
                :alt="selectedPlaceDetail.name"
                class="detail-panel-image"
                loading="lazy"
                @error="handleImageError"
              >
              <div v-else class="detail-panel-image-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span>{{ selectedPlaceDetail.name }}</span>
              </div>
              <div class="detail-panel-image-overlay">
                <button class="detail-panel-close" @click="closeDetailPanel" aria-label="关闭">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
                <button class="detail-panel-nav-btn" @click="navigateToPlace" aria-label="去这里">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/>
                  </svg>
                  <span>去这里</span>
                </button>
              </div>
            </div>

            <div class="detail-panel-body" v-if="selectedPlaceDetail">
              <div class="detail-panel-title-section">
                <h2 class="detail-panel-title">{{ selectedPlaceDetail.name }}</h2>
                <div class="detail-panel-meta" v-if="selectedPlaceDetail.type">
                  <span class="detail-panel-type">{{ selectedPlaceDetail.type }}</span>
                  <span class="detail-panel-rating" v-if="selectedPlaceDetail.rating">
                    <svg viewBox="0 0 24 24" fill="currentColor" class="detail-panel-star">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    {{ selectedPlaceDetail.rating }}
                  </span>
                </div>
              </div>

              <div class="detail-panel-info-section">
                <div class="detail-panel-info-item" v-if="selectedPlaceDetail.address">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="detail-panel-info-icon">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <div class="detail-panel-info-content">
                    <div class="detail-panel-info-label">地址</div>
                    <div class="detail-panel-info-value">{{ selectedPlaceDetail.address }}</div>
                  </div>
                </div>

                <div class="detail-panel-info-item" v-if="selectedPlaceDetail.tel">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="detail-panel-info-icon">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                  <div class="detail-panel-info-content">
                    <div class="detail-panel-info-label">电话</div>
                    <a :href="'tel:' + selectedPlaceDetail.tel" class="detail-panel-info-link">{{ selectedPlaceDetail.tel }}</a>
                  </div>
                </div>

                <div class="detail-panel-info-item" v-if="selectedPlaceDetail.biz_ext?.opening_hours">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="detail-panel-info-icon">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                  <div class="detail-panel-info-content">
                    <div class="detail-panel-info-label">营业时间</div>
                    <div class="detail-panel-info-value">{{ selectedPlaceDetail.biz_ext.opening_hours }}</div>
                  </div>
                </div>
              </div>

              <div class="detail-panel-actions">
                <button class="detail-panel-action-btn" @click="toggleFavorite" :class="{ 'is-favorite': isFavorite }">
                  <svg viewBox="0 0 24 24" :fill="isFavorite ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                  </svg>
                  <span>{{ isFavorite ? '已收藏' : '收藏' }}</span>
                </button>
                <button class="detail-panel-action-btn" @click="searchNearby">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35"/>
                  </svg>
                  <span>搜周边</span>
                </button>
                <button class="detail-panel-action-btn" @click="sharePlace">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="18" cy="5" r="3"/>
                    <circle cx="6" cy="12" r="3"/>
                    <circle cx="18" cy="19" r="3"/>
                    <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>
                  </svg>
                  <span>分享</span>
                </button>
              </div>
            </div>

            <div class="detail-panel-footer" v-if="selectedPlaceDetail?.biz_ext?.rating">
              <div class="detail-panel-source">
                <span>数据来源：高德地图</span>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="dialog">
        <div v-if="showLocationDialog" class="location-dialog-overlay" @click.self="closeLocationDialog">
          <div class="location-dialog">
            <div class="location-dialog-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 2v4m0 12v4M2 12h4m12 0h4"/>
              </svg>
            </div>
            <div class="location-dialog-title">开启定位服务</div>
            <div class="location-dialog-desc">需要在系统设置中开启定位服务才能使用定位功能</div>
            <div class="location-dialog-actions">
              <button class="location-dialog-btn cancel" @click="closeLocationDialog">暂不开启</button>
              <button class="location-dialog-btn confirm" @click="goToLocationSettings">去设置</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'

const props = defineProps({
  searchPlace: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['search-complete'])

const mapContainer = ref(null)
const fullscreenMapContainer = ref(null)
const searchInput = ref(null)
const searchKeyword = ref('')
const fullscreenSearchKeyword = ref('')
const searchResults = ref([])
const fullscreenSearchResults = ref([])
const mapLoading = ref(true)
const showGestureTip = ref(false)
const isFullscreen = ref(false)
const showRoutePanel = ref(false)
const routeDestination = ref(null)
const selectedRouteMode = ref('driving')
const routeResult = ref(null)
const isRouteLoading = ref(false)
const routeError = ref('')
const currentPosition = ref(null)
const isLocating = ref(false)
const locatingStatus = ref('')
const locationType = ref('')
const showLocationDialog = ref(false)
const currentIndoorPoiId = ref(null)
const hasRoute = ref(false)
const routeStatusText = ref('')
const selectedQuickLocation = ref(null)
const isFullscreenLocating = ref(false)
const showDetailPanel = ref(false)
const selectedPlaceDetail = ref(null)
const isFavorite = ref(false)
const mapLoadError = ref(false)
const mapLoadRetryCount = ref(0)

let map = null
let fullscreenMap = null
let AMap = null
let marker = null
let fullscreenMarker = null
let userLocationMarker = null
let startMarker = null
let endMarker = null
let fullscreenRoutePolyline = null
let fullscreenStartMarker = null
let fullscreenEndMarker = null
let fullscreenUserLocationMarker = null
let placeSearch = null
let driving = null
let riding = null
let walking = null
let routePolyline = null
let geolocationControl = null
let fullscreenGeolocationControl = null
let autoRefreshTimer = null

const ROUTE_STORAGE_KEY = 'yunnan_travel_route'

const quickLocations = {
  昆明: [
    { name: '斗南花市', emoji: '🌸', lnglat: [102.788, 24.903], indoorPoiId: 'B0FFGF6XB3' }
  ],
  大理: [
    { name: '大理古城', emoji: '🏯', lnglat: [100.164, 25.694836], indoorPoiId: 'B0FFFZH0RQ' },
    { name: '洱海', emoji: '🌊', lnglat: [100.247321, 25.603053], indoorPoiId: 'B0KGLSSJRT' },
    { name: '喜洲古镇', emoji: '🏘️', lnglat: [100.131582, 25.85295], indoorPoiId: 'B0FFH27SSH' },
    { name: '双廊古镇', emoji: '🌅', lnglat: [100.194322, 25.908323], indoorPoiId: 'B036814RT7' }
  ],
  丽江: [
    { name: '丽江古城', emoji: '🏔️', lnglat: [100.235517, 26.870507], indoorPoiId: 'B0378008PR' }
  ]
}

const routeModes = [
  { value: 'driving', label: '驾车', icon: '🚗' },
  { value: 'riding', label: '骑行', icon: '🚴' },
  { value: 'walking', label: '步行', icon: '🚶' }
]

const createMarkerContent = () => {
  return `<div style="width:32px;height:32px;">
    <img src="/images/icons/marker.svg" style="width:100%;height:100%;" />
  </div>`
}

const createUserLocationContent = () => {
  return '<div style="width:20px;height:20px;background:#ef4444;border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>'
}

const safeStorage = {
  getItem (key) {
    try {
      return localStorage.getItem(key)
    } catch (e) {
      return null
    }
  },
  setItem (key, value) {
    try {
      localStorage.setItem(key, value)
    } catch (e) {}
  }
}

const saveRouteToStorage = () => {
  if (!currentPosition.value || !routeDestination.value) return

  const routeData = {
    hasRoute: true,
    userLocation: [currentPosition.value.lng, currentPosition.value.lat],
    targetLocation: [routeDestination.value.location.lng, routeDestination.value.location.lat],
    targetName: routeDestination.value.name,
    routeMode: selectedRouteMode.value,
    timestamp: Date.now()
  }
  safeStorage.setItem(ROUTE_STORAGE_KEY, JSON.stringify(routeData))
  hasRoute.value = true
  updateRouteStatusText()
}

const restoreRouteFromStorage = () => {
  const savedData = safeStorage.getItem(ROUTE_STORAGE_KEY)
  if (!savedData) return null

  try {
    const routeData = JSON.parse(savedData)
    if (routeData.hasRoute && routeData.userLocation && routeData.targetLocation) {
      return routeData
    }
  } catch (e) {
    console.error('恢复路线数据失败:', e)
  }
  return null
}

const clearRouteFromStorage = () => {
  safeStorage.setItem(ROUTE_STORAGE_KEY, '')
  hasRoute.value = false
  updateRouteStatusText()
}

const updateRouteStatusText = () => {
  if (hasRoute.value) {
    routeStatusText.value = '路线已保存，页面可见时自动刷新位置'
  } else {
    routeStatusText.value = '搜索目的地开始规划路线'
  }
}

const startAutoRefresh = () => {
  if (autoRefreshTimer) return
  if (!hasRoute.value) return

  autoRefreshTimer = setInterval(() => {
    if (document.visibilityState === 'visible') {
      updateUserLocation()
    }
  }, 10000)
  console.log('开启自动刷新')
}

const stopAutoRefresh = () => {
  if (autoRefreshTimer) {
    clearInterval(autoRefreshTimer)
    autoRefreshTimer = null
    console.log('停止自动刷新')
  }
}

const handleVisibilityChange = () => {
  if (document.visibilityState === 'visible' && hasRoute.value) {
    updateUserLocation()
    startAutoRefresh()
  } else {
    stopAutoRefresh()
  }
}

const updateUserLocation = (panToLocation = false) => {
  if (!geolocationControl || !map) return

  geolocationControl.getCurrentPosition((status, result) => {
    if (status === 'complete' && result.position) {
      const { lng, lat } = result.position
      currentPosition.value = { lng, lat }

      if (userLocationMarker) {
        userLocationMarker.setPosition([lng, lat])
      } else {
        userLocationMarker = new AMap.Marker({
          position: [lng, lat],
          content: createUserLocationContent(),
          offset: new AMap.Pixel(-10, -10),
          zIndex: 9999
        })
        userLocationMarker.setMap(map)
      }

      if (panToLocation) {
        map.setCenter([lng, lat])
        map.setZoom(15)
      }

      console.log('位置已更新:', lng, lat)
    }
  })
}

const dismissGestureTip = () => {
  showGestureTip.value = false
  safeStorage.setItem('mapGestureTipSeen', 'true')
}

const initMap = () => {
  mapLoading.value = true
  mapLoadError.value = false
  locatingStatus.value = '正在加载地图...'

  window._AMapSecurityConfig = {
    securityJsCode: 'd74b83d940be20495496bfd02626213e'
  }

  AMapLoader.load({
    key: 'c59e09c3d89a186259e126e7dd34aa5e',
    version: '2.0',
    plugins: [
      'AMap.Scale',
      'AMap.PlaceSearch',
      'AMap.Geolocation',
      'AMap.Driving',
      'AMap.Riding',
      'AMap.Walking',
      'AMap.IndoorMap'
    ]
  })
    .then((AMapInstance) => {
      AMap = AMapInstance
      mapLoadError.value = false
      mapLoadRetryCount.value = 0
      map = new AMap.Map('amap-container', {
        viewMode: '3D',
        pitch: 35,
        rotation: 0,
        rotateEnable: true,
        pitchEnable: true,
        zoom: 11,
        zooms: [2, 20],
        center: [100.267, 25.6],
        showLabel: true,
        touchZoom: true,
        touchZoomCenter: 1,
        dragEnable: true,
        showIndoorMap: true
      })

      map.addControl(new AMap.Scale())

      placeSearch = new AMap.PlaceSearch({
        pageSize: 10,
        pageIndex: 1,
        city: '云南',
        citylimit: false,
        extensions: 'all'
      })

      driving = new AMap.Driving({ policy: AMap.DrivingPolicy.LEAST_TIME })
      riding = new AMap.Riding()
      walking = new AMap.Walking()

      geolocationControl = new AMap.Geolocation({
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
        convert: true,
        showButton: false,
        showMarker: false,
        showCircle: false,
        panToLocation: false,
        zoomToAccuracy: false,
        noGeoLocation: false,
        geoLocationFirst: true,
        useNative: true,
        getCityWhenFail: true
      })
      map.addControl(geolocationControl)

      map.on('indoor_create', () => {
        console.log('室内地图图层已创建')
        if (currentIndoorPoiId.value) {
          map.indoorMap.showIndoorMap(currentIndoorPoiId.value, 1)
        }
        map.indoorMap.on('click', (result) => {
          console.log('=== 室内地图商铺点击 ===')
          console.log('商铺ID:', result.shop?.id)
          console.log('商铺名称:', result.shop?.name)
          console.log('完整结果:', result)
        })
      })

      mapLoading.value = false

      const savedRoute = restoreRouteFromStorage()
      if (savedRoute) {
        console.log('发现已保存路线，正在恢复...')
        currentPosition.value = {
          lng: savedRoute.userLocation[0],
          lat: savedRoute.userLocation[1]
        }
        routeDestination.value = {
          name: savedRoute.targetName,
          location: {
            lng: savedRoute.targetLocation[0],
            lat: savedRoute.targetLocation[1]
          }
        }
        selectedRouteMode.value = savedRoute.routeMode || 'driving'

        if (userLocationMarker) {
          userLocationMarker.setMap(null)
        }
        userLocationMarker = new AMap.Marker({
          position: savedRoute.userLocation,
          content: createUserLocationContent(),
          offset: new AMap.Pixel(-10, -10),
          zIndex: 9999
        })
        userLocationMarker.setMap(map)
        map.setCenter(savedRoute.userLocation)
        map.setZoom(13)

        drawRouteOnMap()

        document.addEventListener('visibilitychange', handleVisibilityChange)
        startAutoRefresh()
      } else if (props.searchPlace) {
        searchKeyword.value = props.searchPlace
        handleSearch()
      } else {
        updateUserLocation(true)
        updateRouteStatusText()
      }
    })
    .catch((e) => {
      console.error('地图加载失败:', e)
      mapLoading.value = false
      mapLoadError.value = true
      mapLoadRetryCount.value++
      locatingStatus.value = mapLoadRetryCount.value >= 3
        ? '地图加载失败，请检查网络'
        : '地图加载失败，点击重试'
    })
}

const retryMapLoad = () => {
  if (mapLoadRetryCount.value >= 3) {
    window.location.reload()
  } else {
    initMap()
  }
}

const initFullscreenMap = () => {
  if (fullscreenMap) return
  if (!AMap) {
    console.error('AMap 未初始化，无法创建全屏地图')
    return
  }

  fullscreenMap = new AMap.Map('amap-fullscreen-container', {
    viewMode: '3D',
    pitch: 35,
    rotation: 0,
    rotateEnable: true,
    pitchEnable: true,
    zoom: map ? map.getZoom() : 11,
    zooms: [2, 20],
    center: map && map.getCenter ? [map.getCenter().lng, map.getCenter().lat] : [100.267, 25.6],
    showLabel: true,
    touchZoom: true,
    touchZoomCenter: 1,
    dragEnable: true,
    showIndoorMap: true
  })

  fullscreenMap.addControl(new AMap.Scale())

  fullscreenGeolocationControl = new AMap.Geolocation({
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 0,
    convert: true,
    showButton: false,
    showMarker: true,
    showCircle: true,
    panToLocation: true,
    zoomToAccuracy: true,
    noGeoLocation: false,
    geoLocationFirst: true,
    useNative: true,
    getCityWhenFail: true
  })
  fullscreenMap.addControl(fullscreenGeolocationControl)

  if (hasRoute.value && currentPosition.value && routeDestination.value) {
    syncRouteToFullscreen()
  } else if (marker && map) {
    fullscreenMarker = new AMap.Marker({
      position: marker.getPosition(),
      title: marker.getTitle(),
      content: createMarkerContent(),
      offset: new AMap.Pixel(-16, -32)
    })
    fullscreenMarker.setMap(fullscreenMap)
    fullscreenMap.setCenter(marker.getPosition())
    fullscreenMap.setZoom(map.getZoom())
  }
}

const syncRouteToFullscreen = () => {
  if (!fullscreenMap || !AMap || !currentPosition.value || !routeDestination.value) return

  const start = [currentPosition.value.lng, currentPosition.value.lat]
  const end = [routeDestination.value.location.lng, routeDestination.value.location.lat]

  const routePlugin = selectedRouteMode.value === 'driving'
    ? driving
    : selectedRouteMode.value === 'riding'
      ? riding
      : walking

  if (!routePlugin) return

  routePlugin.search(start, end, (status, result) => {
    if (!fullscreenMap) return
    if (status !== 'complete' || !result.routes || result.routes.length === 0) return

    const route = result.routes[0]
    const path = []

    if (selectedRouteMode.value === 'driving' && route.steps) {
      route.steps.forEach(step => {
        if (step.path) {
          step.path.forEach(point => path.push([point.lng, point.lat]))
        }
      })
    } else if (selectedRouteMode.value === 'riding' && route.rides) {
      route.rides.forEach(ride => {
        if (ride.path) {
          ride.path.forEach(point => path.push([point.lng, point.lat]))
        }
      })
    } else if (selectedRouteMode.value === 'walking' && route.steps) {
      route.steps.forEach(step => {
        if (step.path) {
          step.path.forEach(point => path.push([point.lng, point.lat]))
        }
      })
    }

    if (path.length === 0) return

    if (fullscreenRoutePolyline) {
      fullscreenRoutePolyline.setMap(null)
    }
    if (fullscreenStartMarker) {
      fullscreenStartMarker.setMap(null)
    }
    if (fullscreenEndMarker) {
      fullscreenEndMarker.setMap(null)
    }
    if (fullscreenUserLocationMarker) {
      fullscreenUserLocationMarker.setMap(null)
    }

    fullscreenUserLocationMarker = new AMap.Marker({
      position: start,
      content: createUserLocationContent(),
      offset: new AMap.Pixel(-10, -10),
      zIndex: 9999
    })
    fullscreenUserLocationMarker.setMap(fullscreenMap)

    fullscreenRoutePolyline = new AMap.Polyline({
      path,
      strokeColor: '#3b82f6',
      strokeWeight: 6,
      strokeOpacity: 0.8,
      lineJoin: 'round',
      lineCap: 'round'
    })
    fullscreenRoutePolyline.setMap(fullscreenMap)

    fullscreenStartMarker = new AMap.Marker({
      position: start,
      title: '起点',
      content: '<div style="background:#22c55e;color:white;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:bold;">起</div>',
      offset: new AMap.Pixel(-12, -12)
    })
    fullscreenStartMarker.setMap(fullscreenMap)

    fullscreenEndMarker = new AMap.Marker({
      position: end,
      title: routeDestination.value.name,
      content: '<div style="background:#ef4444;color:white;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:bold;">终</div>',
      offset: new AMap.Pixel(-12, -12)
    })
    fullscreenEndMarker.setMap(fullscreenMap)

    fullscreenMap.setFitView([fullscreenRoutePolyline], false, [50, 50, 50, 50])
  })
}

const openFullscreen = () => {
  if (!AMap || !map) {
    console.warn('主地图未加载完成，无法打开全屏地图')
    return
  }

  isFullscreen.value = true
  document.body.style.overflow = 'hidden'
  nextTick(() => {
    initFullscreenMap()
  })
}

const closeFullscreen = () => {
  isFullscreen.value = false
  document.body.style.overflow = ''
  if (fullscreenMap) {
    fullscreenMap.destroy()
    fullscreenMap = null
    fullscreenMarker = null
    fullscreenGeolocationControl = null
    fullscreenRoutePolyline = null
    fullscreenStartMarker = null
    fullscreenEndMarker = null
    fullscreenUserLocationMarker = null
  }
  fullscreenSearchKeyword.value = ''
  fullscreenSearchResults.value = []
}

const handleSearch = () => {
  if (!searchKeyword.value || !placeSearch) return

  placeSearch.search(searchKeyword.value, (status, result) => {
    if (status === 'complete' && result.poiList && result.poiList.pois.length > 0) {
      searchResults.value = result.poiList.pois.map(poi => ({
        id: poi.id,
        name: poi.name,
        address: poi.address,
        district: poi.pname + poi.cityname + poi.adname,
        location: {
          lng: poi.location.lng,
          lat: poi.location.lat
        },
        type: poi.type,
        tel: poi.tel,
        biz_ext: poi.biz_ext
      }))

      if (searchResults.value.length === 1) {
        selectResult(searchResults.value[0])
      }
    } else {
      searchResults.value = []
    }
  })
}

let searchDebounceTimer = null
const handleSearchInput = () => {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer)
  }

  if (!searchKeyword.value || searchKeyword.value.trim().length < 2) {
    searchResults.value = []
    return
  }

  searchDebounceTimer = setTimeout(() => {
    handleSearch()
  }, 300)
}

const handleFullscreenSearch = () => {
  if (!fullscreenSearchKeyword.value || !placeSearch || !fullscreenMap) return

  placeSearch.search(fullscreenSearchKeyword.value, (status, result) => {
    if (!fullscreenMap) return
    if (status === 'complete' && result.poiList && result.poiList.pois.length > 0) {
      fullscreenSearchResults.value = result.poiList.pois.map(poi => ({
        id: poi.id,
        name: poi.name,
        address: poi.address,
        district: poi.pname + poi.cityname + poi.adname,
        location: {
          lng: poi.location.lng,
          lat: poi.location.lat
        },
        type: poi.type,
        tel: poi.tel,
        biz_ext: poi.biz_ext
      }))

      if (fullscreenSearchResults.value.length === 1) {
        selectFullscreenResult(fullscreenSearchResults.value[0])
      }
    } else {
      fullscreenSearchResults.value = []
    }
  })
}

let fullscreenSearchDebounceTimer = null
const handleFullscreenSearchInput = () => {
  if (fullscreenSearchDebounceTimer) {
    clearTimeout(fullscreenSearchDebounceTimer)
  }

  if (!fullscreenSearchKeyword.value || fullscreenSearchKeyword.value.trim().length < 2) {
    fullscreenSearchResults.value = []
    return
  }

  fullscreenSearchDebounceTimer = setTimeout(() => {
    handleFullscreenSearch()
  }, 300)
}

const clearFullscreenSearch = () => {
  fullscreenSearchKeyword.value = ''
  fullscreenSearchResults.value = []
}

const selectFullscreenResult = (item) => {
  if (!fullscreenMap || !item.location) return

  fullscreenSearchResults.value = []

  fullscreenMap.setCenter([item.location.lng, item.location.lat])
  fullscreenMap.setZoom(18)

  if (fullscreenMarker) {
    fullscreenMarker.setMap(null)
  }

  fullscreenMarker = new AMap.Marker({
    position: [item.location.lng, item.location.lat],
    title: item.name,
    content: createMarkerContent(),
    offset: new AMap.Pixel(-16, -32)
  })
  fullscreenMarker.setMap(fullscreenMap)

  routeDestination.value = {
    name: item.name,
    location: {
      lng: item.location.lng,
      lat: item.location.lat
    },
    address: item.address,
    type: item.type,
    tel: item.tel,
    biz_ext: item.biz_ext
  }
}

const selectResult = (item) => {
  if (!map || !item.location) return

  searchResults.value = []

  map.setCenter([item.location.lng, item.location.lat])
  map.setZoom(18)

  if (marker) {
    marker.setMap(null)
  }

  marker = new AMap.Marker({
    position: [item.location.lng, item.location.lat],
    title: item.name,
    content: createMarkerContent(),
    offset: new AMap.Pixel(-16, -32)
  })
  marker.setMap(map)

  routeDestination.value = {
    name: item.name,
    location: {
      lng: item.location.lng,
      lat: item.location.lat
    },
    address: item.address,
    type: item.type,
    tel: item.tel,
    biz_ext: item.biz_ext
  }

  currentIndoorPoiId.value = item.id
  if (map.indoorMap) {
    console.log('尝试显示室内地图, POI ID: B0FFGF6XB3 (斗南花市)')
    map.indoorMap.showIndoorMap('B0FFGF6XB3', 4)
  }

  emit('search-complete', item)
}

const clearSearch = () => {
  searchKeyword.value = ''
  searchResults.value = []
}

const goToLocation = (loc) => {
  if (!map) return

  selectedQuickLocation.value = loc.name
  searchKeyword.value = loc.name
  map.setCenter(loc.lnglat)
  map.setZoom(18)

  if (marker) {
    marker.setMap(null)
  }

  marker = new AMap.Marker({
    position: loc.lnglat,
    title: loc.name,
    content: createMarkerContent(),
    offset: new AMap.Pixel(-16, -32)
  })
  marker.setMap(map)

  routeDestination.value = {
    name: loc.name,
    location: {
      lng: loc.lnglat[0],
      lat: loc.lnglat[1]
    },
    type: loc.type || '景点'
  }

  if (loc.indoorPoiId && map.indoorMap) {
    console.log('显示室内地图, POI ID:', loc.indoorPoiId, loc.name)
    map.indoorMap.showIndoorMap(loc.indoorPoiId, 1)
    currentIndoorPoiId.value = loc.indoorPoiId
  }
}

const openRoutePanelFromButton = () => {
  if (routeDestination.value) {
    openRoutePanel(routeDestination.value)
  }
}

const getMobileEnvInfo = () => {
  const ua = navigator.userAgent
  const isIOS = /iphone|ipad|ipod/i.test(ua)
  const isAndroid = /android/i.test(ua)
  const isWeChat = /MicroMessenger/i.test(ua)
  const isAlipay = /AlipayClient/i.test(ua)
  const isHTTPS = window.location.protocol === 'https:'

  return {
    isIOS,
    isAndroid,
    isWeChat,
    isAlipay,
    isHTTPS,
    isMobile: isIOS || isAndroid,
    ua
  }
}

const closeLocationDialog = () => {
  showLocationDialog.value = false
}

const goToLocationSettings = () => {
  showLocationDialog.value = false

  const env = getMobileEnvInfo()
  const isAndroid = env.isAndroid
  const isIOS = env.isIOS

  if (isAndroid) {
    if (env.isWeChat) {
      alert('请在微信「设置 - 隐私 - 位置信息」中允许定位')
    } else {
      window.location.href = 'intent://settings/location#Intent;scheme=android-app://com.android.settings;end'
      setTimeout(() => {
        window.location.href = 'settings://'
      }, 500)
    }
  } else if (isIOS) {
    if (env.isWeChat) {
      alert('请在微信「设置 - 隐私 - 位置信息」中允许定位，并选择「使用应用期间」')
    } else {
      window.location.href = 'App-Prefs:root=Privacy&path=LOCATION'
      setTimeout(() => {
        window.location.href = 'prefs:root=Privacy&path=LOCATION'
      }, 500)
    }
  } else {
    alert('请手动在系统设置中开启定位服务')
  }
}

const fullscreenLocateMe = () => {
  if (!fullscreenMap || !AMap || !fullscreenGeolocationControl) return

  const env = getMobileEnvInfo()

  console.log('=== 全屏地图定位 - 移动端环境 ===')
  console.log('操作系统:', env.isIOS ? 'iOS' : env.isAndroid ? 'Android' : 'Desktop')
  console.log('HTTPS:', env.isHTTPS ? '是' : '否')

  isFullscreenLocating.value = true

  fullscreenGeolocationControl.getCurrentPosition((status, result) => {
    isFullscreenLocating.value = false

    if (!fullscreenMap) return

    if (status === 'complete') {
      const lng = result.position.lng
      const lat = result.position.lat
      const type = result.location_type

      console.log('全屏定位成功:', lng, lat, '类型:', type, '精度:', result.accuracy)

      currentPosition.value = { lng, lat }
      locationType.value = type

      fullscreenMap.setCenter([lng, lat])
      fullscreenMap.setZoom(15)

      if (fullscreenUserLocationMarker) {
        fullscreenUserLocationMarker.setPosition([lng, lat])
      } else {
        fullscreenUserLocationMarker = new AMap.Marker({
          position: [lng, lat],
          content: createUserLocationContent(),
          offset: new AMap.Pixel(-10, -10),
          zIndex: 9999
        })
        fullscreenUserLocationMarker.setMap(fullscreenMap)
      }
    } else {
      console.error('全屏定位失败:', result)
      console.error('错误码:', result.error_code || result.info)
      console.error('错误信息:', result.message)

      const errorCode = result.error_code || result.info
      const errorMessage = result.message || ''

      if (errorCode === 'PERMISSION_DENIED' || errorMessage.includes('permission denied') || errorMessage.includes('Permission denied')) {
        showLocationDialog.value = true
      } else if (errorCode === 'POSITION_UNAVAILABLE' || errorMessage.includes('unavailable')) {
        showLocationDialog.value = true
      } else if (errorMessage.includes('Get ipLocation') || errorMessage.includes('ipLocation failed')) {
        showLocationDialog.value = true
      } else if (errorCode === 'TIMEOUT' || errorMessage.includes('timeout')) {
        alert('GPS信号弱，定位超时。请移至开阔地带后重新定位')
      } else if (!env.isHTTPS && env.isMobile) {
        alert('当前非HTTPS环境，定位功能受限')
      } else {
        alert('定位失败，请刷新页面重试')
      }
    }
  })
}

const fullscreenReset = () => {
  if (!fullscreenMap) return

  if (fullscreenMarker) {
    fullscreenMarker.setMap(null)
    fullscreenMarker = null
  }

  fullscreenSearchKeyword.value = ''
  fullscreenMap.setRotation(0)
  fullscreenMap.setPitch(35)

  if (currentPosition.value) {
    fullscreenMap.setCenter([currentPosition.value.lng, currentPosition.value.lat])
    fullscreenMap.setZoom(14)
  } else {
    fullscreenLocateMe()
  }
}

const openRoutePanel = async (destination) => {
  routeDestination.value = destination
  showRoutePanel.value = true
  document.body.style.overflow = 'hidden'

  if (!currentPosition.value) {
    isRouteLoading.value = true
    routeError.value = ''

    const env = getMobileEnvInfo()
    console.log('=== 路线规划定位 - 移动端环境 ===')
    console.log('操作系统:', env.isIOS ? 'iOS' : env.isAndroid ? 'Android' : 'Desktop')

    await new Promise((resolve) => {
      const geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
        convert: true,
        showButton: false,
        showMarker: true,
        showCircle: true,
        panToLocation: true,
        zoomToAccuracy: true,
        noGeoLocation: false,
        geoLocationFirst: true,
        useNative: true,
        getCityWhenFail: true
      })

      geolocation.getCurrentPosition((status, result) => {
        console.log('=== 路线规划定位 ===')
        console.log('状态:', status)
        console.log('结果:', result)

        if (status === 'complete') {
          const lng = result.position.lng
          const lat = result.position.lat
          const type = result.location_type

          console.log('起点坐标:', lng, lat)
          console.log('定位类型:', type)
          console.log('精度:', result.accuracy, '米')

          currentPosition.value = { lng, lat }
          locationType.value = type
        } else {
          console.error('定位失败:', result)
          console.error('错误码:', result.error_code || result.info)
          console.error('错误信息:', result.message)

          const errorCode = result.error_code || result.info
          const errorMessage = result.message || ''
          let tip = '无法获取您的位置'

          if (errorCode === 'PERMISSION_DENIED' || errorMessage.includes('permission denied')) {
            tip = '定位权限被拒绝，请授权后重试'
            showLocationDialog.value = true
          } else if (errorCode === 'POSITION_UNAVAILABLE' || errorMessage.includes('unavailable')) {
            tip = '定位服务不可用，请检查系统定位设置'
            showLocationDialog.value = true
          } else if (errorMessage.includes('Get ipLocation') || errorMessage.includes('ipLocation failed')) {
            tip = '网络定位失败，请检查网络或开启GPS'
            showLocationDialog.value = true
          } else if (errorCode === 'TIMEOUT' || errorMessage.includes('timeout')) {
            tip = 'GPS信号弱，定位超时，请移至开阔地带重试'
          } else if (!env.isHTTPS && env.isMobile) {
            tip = '非HTTPS环境，定位功能受限'
          } else if (errorMessage) {
            tip = errorMessage
          }

          routeError.value = tip
          isRouteLoading.value = false
        }
        resolve()
      })
    })
  }

  if (currentPosition.value) {
    planRoute()
  }
}

const closeRoutePanel = () => {
  showRoutePanel.value = false
  document.body.style.overflow = ''
}

const changeRouteMode = (mode) => {
  selectedRouteMode.value = mode
  if (currentPosition.value && routeDestination.value) {
    planRoute()
  }
}

const planRoute = () => {
  if (!currentPosition.value || !routeDestination.value) {
    routeError.value = '请先选择目的地'
    return
  }

  isRouteLoading.value = true
  routeResult.value = null
  routeError.value = ''

  const startLng = currentPosition.value.lng
  const startLat = currentPosition.value.lat
  const endLng = routeDestination.value.location.lng
  const endLat = routeDestination.value.location.lat

  const straightDistance = calculateStraightDistance(startLng, startLat, endLng, endLat)

  console.log('=== 路线规划 ===')
  console.log('起点:', startLng, startLat, '定位类型:', locationType.value)
  console.log('终点:', endLng, endLat, routeDestination.value.name)
  console.log('直线距离:', straightDistance.toFixed(1), '公里')

  const start = [startLng, startLat]
  const end = [endLng, endLat]

  const routePlugin = selectedRouteMode.value === 'driving'
    ? driving
    : selectedRouteMode.value === 'riding'
      ? riding
      : walking

  if (!routePlugin) {
    isRouteLoading.value = false
    routeError.value = '路线规划服务未初始化'
    return
  }

  routePlugin.search(start, end, (status, result) => {
    isRouteLoading.value = false

    console.log('路线规划API结果:', status, result)

    if (status === 'complete' && result.routes && result.routes.length > 0) {
      const route = result.routes[0]
      const distance = route.distance
      const time = route.time
      const routeDistanceKm = distance / 1000

      console.log('规划距离:', routeDistanceKm.toFixed(1), '公里')
      console.log('规划时间:', Math.ceil(time / 60), '分钟')

      if (routeDistanceKm < straightDistance * 0.8) {
        console.warn('警告: 规划距离小于直线距离的80%，可能存在问题')
      }

      routeResult.value = {
        distance: formatDistance(distance),
        time: formatTime(time),
        tolls: selectedRouteMode.value === 'driving' && route.tolls ? `过路费约${route.tolls}元` : null,
        rawDistance: distance,
        rawTime: time
      }
    } else if (status === 'no_data') {
      routeError.value = '两地之间暂无可用路线，请尝试其他目的地'
    } else {
      const errorCode = result.info || result.error_code || ''
      if (errorCode === 'OVER_DIRECTION_RANGE') {
        if (selectedRouteMode.value === 'walking') {
          routeError.value = '步行距离太远了（超过100公里），请选择驾车或骑行'
        } else if (selectedRouteMode.value === 'riding') {
          routeError.value = '骑行距离太远了，请选择驾车出行'
        } else {
          routeError.value = '距离太远，无法规划路线'
        }
      } else {
        routeError.value = '路线规划遇到问题，请稍后再试'
      }
    }
  })
}

const calculateStraightDistance = (lng1, lat1, lng2, lat2) => {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

const getDistanceToLocation = (lnglat) => {
  if (!currentPosition.value) return ''
  const distance = calculateStraightDistance(
    currentPosition.value.lng,
    currentPosition.value.lat,
    lnglat[0],
    lnglat[1]
  )
  if (distance < 1) {
    return Math.round(distance * 1000) + 'm'
  }
  return distance.toFixed(1) + 'km'
}

const getDistanceHint = () => {
  if (!currentPosition.value) return ''
  return '已定位'
}

const formatDistance = (meters) => {
  if (meters >= 1000) {
    return (meters / 1000).toFixed(1) + '公里'
  }
  return meters + '米'
}

const formatTime = (seconds) => {
  if (seconds >= 3600) {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    return `${hours}小时${mins}分钟`
  }
  return Math.ceil(seconds / 60) + '分钟'
}

const openAmapApp = () => {
  if (!currentPosition.value || !routeDestination.value) return

  const startLng = currentPosition.value.lng
  const startLat = currentPosition.value.lat
  const endLng = routeDestination.value.location.lng
  const endLat = routeDestination.value.location.lat
  const endName = encodeURIComponent(routeDestination.value.name)

  const modeMap = {
    driving: 'car',
    riding: 'ride',
    walking: 'walk'
  }

  const url = `https://uri.amap.com/navigation?from=${startLng},${startLat},我的位置&to=${endLng},${endLat},${endName}&mode=${modeMap[selectedRouteMode.value]}&src=云南旅行攻略&coordinate=gaode`

  window.open(url, '_blank')
}

const showRouteOnMap = () => {
  if (!currentPosition.value || !routeDestination.value || !map || !AMap) return

  const start = [currentPosition.value.lng, currentPosition.value.lat]
  const end = [routeDestination.value.location.lng, routeDestination.value.location.lat]

  drawRouteWithPath(start, end)
}

const drawRouteWithPath = (start, end) => {
  const routePlugin = selectedRouteMode.value === 'driving'
    ? driving
    : selectedRouteMode.value === 'riding'
      ? riding
      : walking

  if (!routePlugin) return

  routePlugin.search(start, end, (status, result) => {
    console.log('路线规划结果:', status, result)

    if (!map) return
    if (status !== 'complete' || !result.routes || result.routes.length === 0) {
      console.error('路线绘制失败:', status, result)
      return
    }

    const route = result.routes[0]
    const path = []

    if (selectedRouteMode.value === 'driving' && route.steps) {
      route.steps.forEach(step => {
        if (step.path) {
          step.path.forEach(point => {
            path.push([point.lng, point.lat])
          })
        }
      })
    } else if (selectedRouteMode.value === 'riding' && route.rides) {
      route.rides.forEach(ride => {
        if (ride.path) {
          ride.path.forEach(point => {
            path.push([point.lng, point.lat])
          })
        }
      })
    } else if (selectedRouteMode.value === 'walking' && route.steps) {
      route.steps.forEach(step => {
        if (step.path) {
          step.path.forEach(point => {
            path.push([point.lng, point.lat])
          })
        }
      })
    }

    if (path.length === 0) {
      console.error('无法获取路径点')
      return
    }

    if (routePolyline) {
      routePolyline.setMap(null)
    }
    if (startMarker) {
      startMarker.setMap(null)
    }
    if (endMarker) {
      endMarker.setMap(null)
    }

    routePolyline = new AMap.Polyline({
      path,
      strokeColor: '#3b82f6',
      strokeWeight: 6,
      strokeOpacity: 0.8,
      lineJoin: 'round',
      lineCap: 'round'
    })
    routePolyline.setMap(map)

    startMarker = new AMap.Marker({
      position: start,
      title: '起点',
      content: '<div style="background:#22c55e;color:white;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:bold;">起</div>',
      offset: new AMap.Pixel(-12, -12)
    })
    startMarker.setMap(map)

    endMarker = new AMap.Marker({
      position: end,
      title: routeDestination.value?.name || '终点',
      content: '<div style="background:#ef4444;color:white;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:bold;">终</div>',
      offset: new AMap.Pixel(-12, -12)
    })
    endMarker.setMap(map)

    map.setFitView([routePolyline], false, [50, 50, 50, 50])

    saveRouteToStorage()

    document.addEventListener('visibilitychange', handleVisibilityChange)
    startAutoRefresh()

    closeRoutePanel()
  })
}

const drawRouteOnMap = () => {
  if (!currentPosition.value || !routeDestination.value || !map || !AMap) return

  const start = [currentPosition.value.lng, currentPosition.value.lat]
  const end = [routeDestination.value.location.lng, routeDestination.value.location.lat]

  drawRouteWithPath(start, end)
}

const clearRoute = () => {
  if (routePolyline) {
    routePolyline.setMap(null)
    routePolyline = null
  }
  if (startMarker) {
    startMarker.setMap(null)
    startMarker = null
  }
  if (endMarker) {
    endMarker.setMap(null)
    endMarker = null
  }
  if (userLocationMarker) {
    userLocationMarker.setMap(null)
    userLocationMarker = null
  }
  if (marker) {
    marker.setMap(null)
    marker = null
  }

  routeDestination.value = null
  routeResult.value = null
  searchKeyword.value = ''
  searchResults.value = []
  selectedQuickLocation.value = null

  stopAutoRefresh()
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  clearRouteFromStorage()
}

watch(() => props.searchPlace, (newVal) => {
  if (newVal) {
    searchKeyword.value = newVal
    nextTick(() => {
      handleSearch()
    })
  }
})

const refreshLocation = () => {
  if (isLocating.value) return

  isLocating.value = true
  locatingStatus.value = '正在获取位置...'

  updateUserLocation(true)

  setTimeout(() => {
    isLocating.value = false
    locatingStatus.value = ''
  }, 3000)
}

const triggerPlanRoute = () => {
  if (routeDestination.value) {
    openRoutePanel(routeDestination.value)
  }
}

const triggerClearRoute = () => {
  clearRoute()
}

const triggerRefreshLocation = () => {
  refreshLocation()
}

const closeDetailPanel = () => {
  showDetailPanel.value = false
  document.body.style.overflow = ''
}

const handleImageError = (e) => {
  const target = e.target
  target.style.display = 'none'
  const placeholder = target.parentElement.querySelector('.detail-panel-image-placeholder')
  if (placeholder) {
    placeholder.style.display = 'flex'
  }
}

const navigateToPlace = () => {
  if (selectedPlaceDetail.value) {
    closeDetailPanel()
    openRoutePanel(selectedPlaceDetail.value)
  }
}

const toggleFavorite = () => {
  if (!selectedPlaceDetail.value) return

  const savedFavorites = safeStorage.getItem('map_favorites')
  let favorites = []

  try {
    favorites = savedFavorites ? JSON.parse(savedFavorites) : []
  } catch (e) {
    favorites = []
  }

  if (isFavorite.value) {
    favorites = favorites.filter(f => f.name !== selectedPlaceDetail.value.name)
    isFavorite.value = false
  } else {
    favorites.push({
      name: selectedPlaceDetail.value.name,
      address: selectedPlaceDetail.value.address,
      location: selectedPlaceDetail.value.location
    })
    isFavorite.value = true
  }

  safeStorage.setItem('map_favorites', JSON.stringify(favorites))
}

const searchNearby = () => {
  if (selectedPlaceDetail.value?.name) {
    searchKeyword.value = selectedPlaceDetail.value.name + ' 周边'
    closeDetailPanel()
    handleSearch()
  }
}

const sharePlace = async () => {
  if (!selectedPlaceDetail.value) return

  const shareData = {
    title: selectedPlaceDetail.value.name,
    text: selectedPlaceDetail.value.address || '',
    url: window.location.href
  }

  if (navigator.share) {
    try {
      await navigator.share(shareData)
    } catch (e) {
      console.log('分享取消或失败')
    }
  } else {
    const text = `${selectedPlaceDetail.value.name}\n${selectedPlaceDetail.value.address || ''}`
    try {
      await navigator.clipboard.writeText(text)
      alert('已复制到剪贴板')
    } catch (e) {
      alert('分享功能暂不可用')
    }
  }
}

defineExpose({
  refreshLocation: triggerRefreshLocation,
  planRoute: triggerPlanRoute,
  clearRoute: triggerClearRoute
})

onMounted(() => {
  // 忽略高德地图定位服务的内部网络错误
  const handleError = (event) => {
    if (event.target?.tagName === 'SCRIPT' &&
        (event.target.src?.includes('geolocation') ||
         event.target.src?.includes('127.0.0.1'))) {
      event.preventDefault()
      return true
    }
  }
  window.addEventListener('error', handleError, true)
  window._mapErrorHandler = handleError

  initMap()
  if (safeStorage.getItem('mapGestureTipSeen') !== 'true') {
    setTimeout(() => {
      showGestureTip.value = true
    }, 1500)
  }
})

onUnmounted(() => {
  stopAutoRefresh()
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  if (window._mapErrorHandler) {
    window.removeEventListener('error', window._mapErrorHandler, true)
    delete window._mapErrorHandler
  }
  if (map) {
    map.destroy()
  }
  if (fullscreenMap) {
    fullscreenMap.destroy()
  }
})
</script>

<style scoped>
@import '../slides-common.css';

.map-section {
  --amap-blue: oklch(55% 0.20 250);
  --amap-blue-light: oklch(92% 0.04 250);
  --amap-blue-soft: oklch(88% 0.06 250);

  display: flex;
  flex-direction: column;
  padding: var(--space-md);
  padding-bottom: var(--space-xl);
  gap: 0;
  max-width: 680px;
  margin: 0 auto;
  width: 100%;
}

.guide-module {
  position: relative;
  padding-top: var(--space-lg);
}

.guide-module + .guide-module::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, var(--border) 20%, var(--border) 80%, transparent 100%);
}

.guide-module-header {
  margin-bottom: var(--space-md);
}

.guide-module-header-static {
  cursor: default;
}

.guide-module-title {
  font-family: 'LXGW WenKai', serif;
  font-size: var(--text-lg);
  font-weight: 400;
  color: var(--forest);
  letter-spacing: 0.05em;
  margin: 0;
}

.guide-module-title-large {
  font-size: clamp(1.25rem, 5vw, 1.5rem);
}

.guide-module-content-wrapper {
  min-height: 0;
}

.guide-module-expanded .guide-module-content-wrapper {
  display: block;
}

.map-search-bar {
  display: flex;
  gap: var(--space-sm);
  padding: var(--space-md);
  background: var(--card);
  border-radius: var(--space-lg);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04);
  transition: box-shadow var(--duration-fast) var(--ease-out-quart);
}

.map-search-bar:focus-within {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06);
}

.map-search-input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  background: var(--earth-light);
  border-radius: var(--space-md);
  padding: 0 var(--space-md);
  min-height: 50px;
  transition: background var(--duration-fast) var(--ease-out-quart);
}

.map-search-input-wrapper:focus-within {
  background: var(--card);
  box-shadow: inset 0 0 0 2px var(--forest);
}

.map-search-icon {
  width: 20px;
  height: 20px;
  color: var(--text-muted);
  flex-shrink: 0;
  transition: color var(--duration-fast) var(--ease-out-quart);
}

.map-search-input-wrapper:focus-within .map-search-icon {
  color: var(--forest);
}

.map-search-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: var(--space-sm) var(--space-sm);
  font-size: var(--text-base);
  font-family: inherit;
  color: var(--text);
  outline: none;
  min-width: 0;
}

.map-search-input::placeholder {
  color: var(--text-muted);
}

.map-search-clear {
  width: 28px;
  height: 28px;
  border: none;
  background: var(--border);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  flex-shrink: 0;
  transition: all var(--duration-fast) var(--ease-out-quart);
}

.map-search-clear:hover {
  background: var(--sunset);
}

.map-search-clear:hover svg {
  color: white;
}

.map-search-clear:active {
  transform: scale(0.9);
}

.map-search-clear svg {
  width: 14px;
  height: 14px;
  color: var(--text-muted);
  transition: color var(--duration-fast) var(--ease-out-quart);
}

.map-search-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2xs);
  padding: 0 var(--space-lg);
  background: linear-gradient(135deg, var(--amap-blue) 0%, oklch(50% 0.18 250) 100%);
  color: white;
  border: none;
  border-radius: var(--space-md);
  font-size: var(--text-base);
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  min-height: 50px;
  transition: all var(--duration-fast) var(--ease-out-quart);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.map-search-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.map-search-btn:active:not(:disabled) {
  transform: translateY(0);
}

.map-search-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

.map-search-btn-icon {
  width: 18px;
  height: 18px;
}

.map-search-btn-text {
  font-weight: 600;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.map-preview-card {
  background: var(--card);
  border-radius: var(--space-md);
  border: 1px solid var(--border);
  overflow: hidden;
  position: relative;
}

.map-preview-container.map-container-main {
  height: 220px;
  position: relative;
}

#amap-container {
  width: 100%;
  height: 100%;
}

.map-loading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  background: var(--bg);
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.map-loading-error-icon {
  font-size: 2rem;
  margin-bottom: var(--space-xs);
}

.map-loading-error-text {
  color: var(--sunset);
  font-weight: 500;
  text-align: center;
  padding: 0 var(--space-md);
}

.map-loading-retry-btn {
  margin-top: var(--space-sm);
  padding: var(--space-sm) var(--space-lg);
  background: var(--forest);
  color: white;
  border: none;
  border-radius: var(--space-md);
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all var(--duration-fast) var(--ease-out-quart);
}

.map-loading-retry-btn:active {
  transform: scale(0.98);
}

.map-loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border);
  border-top-color: var(--forest);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.map-locating-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  z-index: 20;
}

.map-locating-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.map-locating-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border);
  border-top-color: var(--forest);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.map-expand-btn {
  position: absolute;
  bottom: var(--space-sm);
  right: var(--space-sm);
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-sm);
  background: var(--forest);
  color: white;
  border: none;
  border-radius: var(--space-sm);
  font-size: var(--text-xs);
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all var(--duration-fast) var(--ease-out-quart);
}

.map-expand-btn:hover {
  background: var(--sunset);
  transform: scale(1.02);
}

.map-expand-btn:active {
  transform: scale(0.98);
}

.map-expand-btn svg {
  width: 14px;
  height: 14px;
}

.map-gesture-tip {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.85);
  color: white;
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--space-sm);
  animation: gestureTipIn 0.4s var(--ease-out-quart);
  z-index: 50;
}

@keyframes gestureTipIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.map-gesture-tip-content {
  display: flex;
  gap: var(--space-md);
  margin-bottom: var(--space-xs);
}

.map-gesture-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.map-gesture-item svg {
  width: 18px;
  height: 18px;
  color: var(--sunset);
}

.map-gesture-item span {
  font-size: 0.65rem;
  white-space: nowrap;
}

.map-gesture-close {
  width: 100%;
  padding: var(--space-2xs) var(--space-sm);
  background: var(--forest);
  color: white;
  border: none;
  border-radius: var(--space-xs);
  font-size: var(--text-xs);
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
}

.map-results {
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  max-height: 150px;
  background: var(--card);
  border-radius: var(--space-sm);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 100;
  animation: resultsIn 0.25s var(--ease-out-quart);
}

@keyframes resultsIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.map-results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-xs) var(--space-sm);
  border-bottom: 1px solid var(--border);
  background: var(--earth-light);
}

.map-results-title {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--forest);
}

.map-results-close {
  width: 20px;
  height: 20px;
  border: none;
  background: var(--card);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-results-close svg {
  width: 10px;
  height: 10px;
  color: var(--text-muted);
}

.map-results-list {
  overflow-y: auto;
  max-height: 110px;
}

.map-result-item {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-sm);
  border-bottom: 1px solid var(--border);
}

.map-result-item:last-child {
  border-bottom: none;
}

.map-result-main {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  cursor: pointer;
  min-width: 0;
}

.map-result-main:active {
  background: var(--earth-light);
}

.map-result-index {
  width: 20px;
  height: 20px;
  background: var(--forest);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 600;
  flex-shrink: 0;
}

.map-result-info {
  flex: 1;
  min-width: 0;
}

.map-result-name {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.map-result-address {
  font-size: 0.65rem;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.map-result-nav-btn {
  width: 32px;
  height: 32px;
  border: 1px solid var(--forest);
  background: var(--forest-light);
  border-radius: var(--space-xs);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all var(--duration-fast) var(--ease-out-quart);
}

.map-result-nav-btn:hover {
  background: var(--forest);
}

.map-result-nav-btn:hover svg {
  color: white;
}

.map-result-nav-btn:active {
  transform: scale(0.95);
}

.map-result-nav-btn svg {
  width: 16px;
  height: 16px;
  color: var(--forest);
}

.map-actions.map-toolbar {
  display: flex;
  gap: var(--space-sm);
  padding: var(--space-sm);
  background: var(--card);
  border-radius: var(--space-md);
  border: 1px solid var(--border);
}

.map-action-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2xs);
  padding: var(--space-sm);
  background: var(--earth-light);
  border: none;
  border-radius: var(--space-sm);
  cursor: pointer;
  font-family: inherit;
  min-height: 60px;
  transition: background var(--duration-fast) var(--ease-out-quart),
              transform var(--duration-fast) var(--ease-out-quart),
              box-shadow var(--duration-fast) var(--ease-out-quart);
}

.map-action-btn:hover {
  background: var(--forest-light);
}

.map-action-btn:focus-visible {
  outline: 2px solid var(--forest);
  outline-offset: 2px;
  background: var(--forest-light);
}

.map-action-btn:active {
  transform: scale(0.98);
}

.map-action-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.map-action-btn:disabled:active {
  transform: none;
}

.map-action-btn svg {
  width: 20px;
  height: 20px;
  color: var(--forest);
}

.map-action-btn span {
  font-size: var(--text-xs);
  color: var(--text);
  font-weight: 600;
}

.map-action-btn.danger svg {
  color: var(--sunset);
}

.map-action-btn.danger:hover:not(:disabled) {
  background: var(--sunset-soft);
}

.map-route-status.map-route-status-bar {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  background: var(--forest-light);
  border-radius: var(--space-md);
  border: 1px solid var(--forest);
}

.map-route-status-icon {
  font-size: 1rem;
}

.map-route-status-text {
  font-size: var(--text-xs);
  color: var(--forest);
  font-weight: 500;
}

.map-quick-locations {
  padding: var(--space-md);
  background: var(--card);
  border-radius: var(--space-md);
  border: 1px solid var(--border);
}

.map-quick-title {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--forest);
  margin-bottom: var(--space-sm);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-sm);
}

.map-quick-distance-hint {
  font-size: 0.65rem;
  color: var(--sunset);
  font-weight: 500;
}

.map-quick-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.map-quick-category.map-quick-category-label {
  width: 100%;
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--forest);
  padding: var(--space-xs) 0;
  border-bottom: 1px solid var(--border);
  margin-bottom: var(--space-xs);
}

.map-quick-item {
  display: flex;
  align-items: center;
  gap: var(--space-2xs);
  padding: var(--space-sm) var(--space-md);
  background: var(--earth-light);
  border: 1px solid var(--border);
  border-radius: var(--space-lg);
  cursor: pointer;
  font-family: inherit;
  font-size: var(--text-xs);
  color: var(--text);
  min-height: 44px;
  transition: all var(--duration-fast) var(--ease-out-quart);
}

.map-quick-item:hover {
  background: var(--forest-light);
  border-color: var(--forest);
}

.map-quick-item-selected {
  background: var(--forest);
  color: white;
  border-color: var(--forest);
}

.map-quick-item-selected .map-quick-distance {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.map-quick-item:focus-visible {
  outline: 2px solid var(--forest);
  outline-offset: 2px;
  background: var(--forest-light);
}

.map-quick-item:active {
  transform: scale(0.96);
}

.map-quick-emoji {
  font-size: 1rem;
}

.map-quick-name {
  white-space: nowrap;
}

.map-quick-distance {
  font-size: 0.65rem;
  color: var(--sunset);
  background: var(--sunset-soft);
  padding: 2px 6px;
  border-radius: var(--space-xs);
  font-weight: 600;
  white-space: nowrap;
  margin-left: auto;
}

.map-tips.map-tips-card {
  padding: var(--space-md);
  background: var(--forest-light);
  border-radius: var(--space-md);
  border: 1px solid var(--forest);
}

.map-tip-content p {
  font-size: var(--text-sm);
  color: var(--text);
  margin: 0;
  line-height: 1.8;
}

.map-tip-content p + p {
  margin-top: var(--space-xs);
}

.map-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-md);
}

.map-modal-container {
  width: 100%;
  height: 90vh;
  max-width: 100vw;
  max-height: 95vh;
  background: var(--card);
  border-radius: var(--space-lg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.map-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-sm) var(--space-md);
  border-bottom: 1px solid var(--border);
  background: var(--card);
  flex-shrink: 0;
}

.map-modal-title {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--forest);
}

.map-modal-close {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  background: var(--forest);
  color: white;
  border: none;
  border-radius: var(--space-lg);
  cursor: pointer;
  font-family: inherit;
  font-weight: 600;
  font-size: var(--text-sm);
  transition: all var(--duration-fast) var(--ease-out-quart);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.map-modal-close:hover {
  background: var(--sunset);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.map-modal-close:active {
  transform: translateY(0);
}

.map-modal-close svg {
  width: 18px;
  height: 18px;
}

.map-modal-close-text {
  display: inline;
}

.map-modal-content {
  flex: 1;
  position: relative;
  min-height: 0;
}

#amap-fullscreen-container {
  width: 100%;
  height: 100%;
}

.map-modal-search-bar {
  position: absolute;
  top: var(--space-sm);
  left: var(--space-sm);
  right: var(--space-sm);
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  background: var(--card);
  border-radius: var(--space-lg);
  padding: 0 var(--space-sm);
  min-height: 44px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;
}

.map-modal-search-icon {
  width: 18px;
  height: 18px;
  color: var(--text-muted);
  flex-shrink: 0;
}

.map-modal-search-input {
  flex: 1;
  padding: var(--space-sm) var(--space-xs);
  border: none;
  font-size: 16px;
  font-family: inherit;
  background: transparent;
  color: var(--text);
  min-width: 0;
  outline: none;
}

.map-modal-search-clear {
  width: 24px;
  height: 24px;
  padding: 0;
  background: var(--border);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all var(--duration-fast) var(--ease-out-quart);
}

.map-modal-search-clear:hover {
  background: var(--sunset);
}

.map-modal-search-clear:hover svg {
  color: white;
}

.map-modal-search-clear svg {
  width: 12px;
  height: 12px;
  color: var(--text-muted);
}

.map-modal-search-btn {
  padding: var(--space-sm) var(--space-md);
  background: var(--amap-blue);
  color: white;
  border: none;
  border-radius: var(--space-sm);
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  white-space: nowrap;
  margin-right: calc(var(--space-xs) * -1);
  transition: all var(--duration-fast) var(--ease-out-quart);
}

.map-modal-search-btn:hover:not(:disabled) {
  background: oklch(50% 0.18 250);
}

.map-modal-search-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.map-modal-results {
  position: absolute;
  top: calc(var(--space-sm) + 44px + var(--space-xs));
  left: var(--space-sm);
  right: var(--space-sm);
  max-height: 50%;
  background: var(--card);
  border-radius: var(--space-md);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 10;
}

.map-modal-results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-xs) var(--space-sm);
  border-bottom: 1px solid var(--border);
  background: var(--earth-light);
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--forest);
}

.map-modal-results-close {
  width: 24px;
  height: 24px;
  border: none;
  background: var(--card);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--duration-fast) var(--ease-out-quart);
}

.map-modal-results-close:hover {
  background: var(--sunset);
}

.map-modal-results-close:hover svg {
  color: white;
}

.map-modal-results-close svg {
  width: 12px;
  height: 12px;
  color: var(--text-muted);
}

.map-modal-results-list {
  overflow-y: auto;
  max-height: calc(50% - 36px);
}

.map-modal-result-item {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-sm);
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  transition: background var(--duration-fast) var(--ease-out-quart);
}

.map-modal-result-item:last-child {
  border-bottom: none;
}

.map-modal-result-item:active {
  background: var(--forest-light);
}

.map-modal-result-index {
  width: 24px;
  height: 24px;
  background: var(--forest);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 600;
  flex-shrink: 0;
}

.map-modal-result-info {
  flex: 1;
  min-width: 0;
}

.map-modal-result-name {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.map-modal-result-address {
  font-size: 0.65rem;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.map-modal-result-nav {
  width: 32px;
  height: 32px;
  border: 1px solid var(--forest);
  background: var(--forest-light);
  border-radius: var(--space-xs);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all var(--duration-fast) var(--ease-out-quart);
}

.map-modal-result-nav:hover {
  background: var(--forest);
}

.map-modal-result-nav:hover svg {
  color: white;
}

.map-modal-result-nav svg {
  width: 16px;
  height: 16px;
  color: var(--forest);
}

.map-modal-actions {
  position: absolute;
  bottom: var(--space-sm);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: var(--space-sm);
  z-index: 10;
}

.map-modal-action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: var(--space-sm) var(--space-lg);
  background: var(--card);
  border: none;
  border-radius: var(--space-lg);
  cursor: pointer;
  font-family: inherit;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  transition: all var(--duration-fast) var(--ease-out-quart);
}

.map-modal-action-btn:hover {
  background: var(--forest-light);
}

.map-modal-action-btn:active {
  transform: scale(0.98);
}

.map-modal-action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.map-modal-action-btn svg {
  width: 20px;
  height: 20px;
  color: var(--forest);
}

.map-modal-action-btn span {
  font-size: 0.65rem;
  color: var(--text);
  font-weight: 500;
}

.map-modal-action-btn.is-locating {
  background: var(--forest-light);
}

.map-modal-action-btn.is-locating svg {
  color: var(--forest);
}

.locating-spin {
  animation: spin 1s linear infinite;
}

.map-modal-locating {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.85);
  z-index: 20;
}

.location-dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1002;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-lg);
}

.location-dialog {
  background: var(--card);
  border-radius: var(--space-lg);
  padding: var(--space-xl);
  max-width: 320px;
  width: 100%;
  text-align: center;
}

.location-dialog-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto var(--space-md);
  background: var(--earth-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.location-dialog-icon svg {
  width: 28px;
  height: 28px;
  color: var(--forest);
}

.location-dialog-title {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--text);
  margin-bottom: var(--space-sm);
}

.location-dialog-desc {
  font-size: var(--text-sm);
  color: var(--text-muted);
  margin-bottom: var(--space-lg);
  line-height: 1.5;
}

.location-dialog-actions {
  display: flex;
  gap: var(--space-sm);
}

.location-dialog-btn {
  flex: 1;
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--space-sm);
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  border: none;
}

.location-dialog-btn.cancel {
  background: var(--earth-light);
  color: var(--text-muted);
}

.location-dialog-btn.confirm {
  background: var(--forest);
  color: white;
}

.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.2s ease;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

.route-panel-overlay {
  --amap-blue: oklch(55% 0.20 250);
  --amap-blue-light: oklch(92% 0.04 250);

  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1001;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.route-panel {
  width: 100%;
  max-height: 80vh;
  background: var(--card);
  border-radius: var(--space-lg) var(--space-lg) 0 0;
  padding: var(--space-md);
  overflow-y: auto;
}

.route-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
}

.route-panel-title {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--forest);
}

.route-panel-close {
  width: 32px;
  height: 32px;
  border: none;
  background: var(--earth-light);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.route-panel-close svg {
  width: 16px;
  height: 16px;
  color: var(--text-muted);
}

.route-info {
  margin-bottom: var(--space-md);
}

.route-endpoints {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.route-endpoint {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.route-endpoint-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.route-endpoint-dot.start {
  background: var(--forest);
}

.route-endpoint-dot.end {
  background: var(--sunset);
}

.route-endpoint-text {
  font-size: var(--text-sm);
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.route-endpoint-line {
  width: 2px;
  height: 20px;
  background: var(--border);
  margin-left: 5px;
}

.route-modes {
  display: flex;
  gap: var(--space-xs);
  margin-bottom: var(--space-md);
}

.route-mode-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2xs);
  padding: var(--space-sm);
  background: var(--earth-light);
  border: 2px solid transparent;
  border-radius: var(--space-sm);
  cursor: pointer;
  font-family: inherit;
  transition: all var(--duration-fast) var(--ease-out-quart);
}

.route-mode-btn:hover {
  background: var(--forest-light);
}

.route-mode-btn.active {
  border-color: var(--forest);
  background: var(--forest-light);
}

.route-mode-icon {
  font-size: 1.25rem;
}

.route-mode-label {
  font-size: var(--text-xs);
  color: var(--text);
  font-weight: 600;
}

.route-result {
  background: var(--forest-light);
  border-radius: var(--space-sm);
  padding: var(--space-md);
  margin-bottom: var(--space-md);
}

.route-summary {
  display: flex;
  gap: var(--space-md);
  margin-bottom: var(--space-xs);
}

.route-distance {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--forest);
}

.route-time {
  font-size: var(--text-lg);
  color: var(--text-muted);
  display: flex;
  align-items: center;
}

.route-detail {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.route-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-xl);
  color: var(--text-muted);
}

.route-loading-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid var(--border);
  border-top-color: var(--forest);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.route-error {
  text-align: center;
  padding: var(--space-xl);
  color: var(--sunset);
  font-size: var(--text-sm);
}

.route-actions {
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-sm);
}

.route-action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  background: var(--earth-light);
  border: 1px solid var(--border);
  border-radius: var(--space-sm);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text);
  cursor: pointer;
  font-family: inherit;
  transition: all var(--duration-fast) var(--ease-out-quart);
}

.route-action-btn:hover:not(:disabled) {
  background: var(--forest-light);
  border-color: var(--forest);
}

.route-action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.route-action-btn.primary {
  background: var(--amap-blue);
  color: white;
  border-color: var(--amap-blue);
}

.route-action-btn.primary:hover:not(:disabled) {
  background: oklch(50% 0.18 250);
  border-color: oklch(50% 0.18 250);
}

.route-action-btn svg {
  width: 18px;
  height: 18px;
}

.route-tip {
  text-align: center;
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.fullscreen-enter-active,
.fullscreen-leave-active {
  transition: opacity 0.3s var(--ease-out-quart);
}

.fullscreen-enter-active .map-modal-container,
.fullscreen-leave-active .map-modal-container {
  transition: transform 0.3s var(--ease-out-quart), opacity 0.3s var(--ease-out-quart);
}

.fullscreen-enter-from,
.fullscreen-leave-to {
  opacity: 0;
}

.fullscreen-enter-from .map-modal-container,
.fullscreen-leave-to .map-modal-container {
  transform: scale(0.95);
  opacity: 0;
}

.route-panel-enter-from,
.route-panel-leave-to {
  opacity: 0;
}

.route-panel-enter-from .route-panel,
.route-panel-leave-to .route-panel {
  transform: translateY(100%);
}

.detail-panel-overlay {
  --amap-blue: oklch(55% 0.20 250);
  --amap-blue-light: oklch(92% 0.04 250);

  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1001;
}

.detail-panel {
  position: fixed;
  left: 0;
  top: 0;
  width: min(400px, 85vw);
  height: 100vh;
  background: var(--card);
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.detail-panel-header {
  position: relative;
  height: 200px;
  flex-shrink: 0;
  overflow: hidden;
}

.detail-panel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-panel-image-placeholder {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--forest) 0%, oklch(40% 0.10 160) 50%, var(--sunset) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  color: white;
  padding: var(--space-lg);
}

.detail-panel-image-placeholder svg {
  width: 48px;
  height: 48px;
  opacity: 0.9;
}

.detail-panel-image-placeholder span {
  font-size: var(--text-lg);
  font-weight: 600;
  text-align: center;
  opacity: 0.95;
}

.detail-panel-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, var(--overlay) 0%, transparent 50%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: var(--space-md);
}

.detail-panel-close {
  width: 36px;
  height: 36px;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: flex-end;
  transition: all var(--duration-fast) var(--ease-out-quart);
}

.detail-panel-close:hover {
  background: white;
  transform: scale(1.05);
}

.detail-panel-close svg {
  width: 18px;
  height: 18px;
  color: var(--text);
}

.detail-panel-nav-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  background: var(--amap-blue);
  color: white;
  border: none;
  border-radius: var(--space-lg);
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all var(--duration-fast) var(--ease-out-quart);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.detail-panel-nav-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  background: oklch(50% 0.18 250);
}

.detail-panel-nav-btn svg {
  width: 16px;
  height: 16px;
}

.detail-panel-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-md);
}

.detail-panel-title-section {
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--border);
}

.detail-panel-title {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--text);
  margin: 0 0 var(--space-xs) 0;
  line-height: 1.3;
}

.detail-panel-meta {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.detail-panel-type {
  font-size: var(--text-xs);
  color: var(--forest);
  background: var(--forest-light);
  padding: 2px 8px;
  border-radius: var(--space-xs);
  font-weight: 500;
}

.detail-panel-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--text-sm);
  color: var(--sunset);
  font-weight: 600;
}

.detail-panel-star {
  width: 14px;
  height: 14px;
  color: var(--sunset);
}

.detail-panel-info-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.detail-panel-info-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
}

.detail-panel-info-icon {
  width: 20px;
  height: 20px;
  color: var(--forest);
  flex-shrink: 0;
  margin-top: 2px;
}

.detail-panel-info-content {
  flex: 1;
  min-width: 0;
}

.detail-panel-info-label {
  font-size: var(--text-xs);
  color: var(--text-muted);
  margin-bottom: 2px;
}

.detail-panel-info-value {
  font-size: var(--text-sm);
  color: var(--text);
  line-height: 1.5;
}

.detail-panel-info-link {
  font-size: var(--text-sm);
  color: var(--forest);
  text-decoration: none;
  font-weight: 500;
}

.detail-panel-info-link:hover {
  text-decoration: underline;
}

.detail-panel-actions {
  display: flex;
  gap: var(--space-sm);
  padding-top: var(--space-md);
  border-top: 1px solid var(--border);
}

.detail-panel-action-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2xs);
  padding: var(--space-sm);
  background: var(--earth-light);
  border: 1px solid var(--border);
  border-radius: var(--space-sm);
  font-size: var(--text-xs);
  color: var(--text);
  cursor: pointer;
  font-family: inherit;
  transition: all var(--duration-fast) var(--ease-out-quart);
}

.detail-panel-action-btn:hover {
  background: var(--forest-light);
  border-color: var(--forest);
}

.detail-panel-action-btn:active {
  transform: scale(0.98);
}

.detail-panel-action-btn svg {
  width: 20px;
  height: 20px;
  color: var(--forest);
}

.detail-panel-action-btn.is-favorite svg {
  color: var(--sunset);
}

.detail-panel-footer {
  padding: var(--space-sm) var(--space-md);
  border-top: 1px solid var(--border);
  background: var(--earth-light);
  flex-shrink: 0;
}

.detail-panel-source {
  font-size: 0.65rem;
  color: var(--text-muted);
  text-align: center;
}

.detail-panel-enter-active,
.detail-panel-leave-active {
  transition: opacity 0.3s var(--ease-out-quart);
}

.detail-panel-enter-active .detail-panel,
.detail-panel-leave-active .detail-panel {
  transition: transform 0.3s var(--ease-out-quart);
}

.detail-panel-enter-from,
.detail-panel-leave-to {
  opacity: 0;
}

.detail-panel-enter-from .detail-panel,
.detail-panel-leave-to .detail-panel {
  transform: translateX(-100%);
}

@media (min-width: 768px) {
  .map-preview-container.map-container-main {
    height: 300px;
  }

  .route-panel-overlay {
    align-items: center;
  }

  .route-panel {
    max-width: 400px;
    border-radius: var(--space-lg);
  }

  .detail-panel {
    width: 400px;
  }
}

@media (max-width: 480px) {
  .map-search-bar {
    padding: var(--space-sm);
  }

  .map-search-input-wrapper {
    min-height: 44px;
    padding: 0 var(--space-sm);
  }

  .map-search-input {
    font-size: 16px;
  }

  .map-search-btn {
    min-height: 44px;
    padding: 0 var(--space-md);
  }

  .map-search-btn-text {
    display: none;
  }

  .map-search-btn-icon {
    margin: 0;
  }

  .detail-panel {
    width: 100%;
  }

  .detail-panel-header {
    height: 180px;
  }

  .map-modal-overlay {
    padding: 0;
  }

  .map-modal-container {
    height: 100vh;
    max-height: 100vh;
    border-radius: 0;
  }

  .map-modal-header {
    padding: var(--space-sm);
  }

  .map-modal-close {
    padding: var(--space-sm);
    min-height: 44px;
  }

  .map-modal-close-text {
    display: none;
  }

  .map-modal-search-bar {
    min-height: 44px;
    padding: 0 var(--space-xs);
  }

  .map-modal-search-input {
    font-size: 16px;
  }

  .map-modal-results {
    max-height: 40%;
  }

  .map-modal-actions {
    bottom: var(--space-md);
  }

  .map-modal-action-btn {
    padding: var(--space-sm) var(--space-md);
  }
}

@media (hover: none) and (pointer: coarse) {
  .map-search-btn:active:not(:disabled) {
    transform: scale(0.98);
    opacity: 0.9;
  }

  .map-modal-action-btn:active {
    transform: scale(0.95);
  }

  .map-modal-result-item:active {
    background: var(--forest-light);
  }

  .detail-panel-action-btn:active {
    transform: scale(0.95);
  }

  .detail-panel-nav-btn:active {
    transform: scale(0.98);
  }
}

@media (prefers-reduced-motion: reduce) {
  .guide-module-content,
  .guide-module-toggle {
    transition: none;
  }

  .detail-panel-enter-active,
  .detail-panel-leave-active,
  .detail-panel-enter-active .detail-panel,
  .detail-panel-leave-active .detail-panel {
    transition: none;
  }

  .fullscreen-enter-active,
  .fullscreen-leave-active,
  .fullscreen-enter-active .map-modal-container,
  .fullscreen-leave-active .map-modal-container {
    transition: none;
  }
}

</style>
