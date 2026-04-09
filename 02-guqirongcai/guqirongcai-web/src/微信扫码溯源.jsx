import React, { Component } from 'react';
import {
  Card,
  Tag,
  Descriptions,
  Row,
  Col,
  Button,
  ConfigProvider,
  Spin,
  Result
} from 'antd';

class WechatTrace extends Component {
  state = {
    loading: true,
    error: null,
    validationStatus: 'valid',
    traceData: null
  };

  async componentDidMount() {
    const batchNo = this.getBatchNoFromUrl();
    if (batchNo) {
      this.loadTraceData(batchNo);
    } else {
      this.setState({ loading: false, error: 'invalid_qr' });
    }
  }

  getBatchNoFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('batchNo') || 'BC202401001';
  }

  async loadTraceData(batchNo) {
    setTimeout(() => {
      const mockData = {
        batchNo: batchNo,
        // 1. 产品信息
        productInfo: {
          name: '95%白鹅绒',
          specification: '高规格',
          execStandard: 'GB/T 14272-2021',
          standardCategory: '国家标准',
          produceYear: '2024'
        },
        // 2. 质检信息
        qualityInfo: {
          downContent: '95%',
          turbidity: '≥500mm',
          odor: '无异味',
          fluffiness: '≥15cm'
        },
        // 3. 产品视频
        videos: [
          { title: '原料采购视频', url: 'https://example.com/video1.mp4', cover: 'https://via.placeholder.com/300x200?text=原料采购' },
          { title: '生产加工视频', url: 'https://example.com/video2.mp4', cover: 'https://via.placeholder.com/300x200?text=生产加工' }
        ],
        // 4. 认证信息
        certifications: [
          { name: 'ISO9001质量管理体系认证', img: 'https://via.placeholder.com/150x200?text=ISO9001' },
          { name: '有机产品认证', img: 'https://via.placeholder.com/150x200?text=有机认证' },
          { name: '国家高新技术企业', img: 'https://via.placeholder.com/150x200?text=高新企业' }
        ],
        // 5. 企业信息
        companyInfo: {
          name: '安徽古麒绒材股份有限公司',
          wechatQr: 'https://via.placeholder.com/150x150?text=微信公众号',
          website: 'https://www.guqirongcai.com'
        }
      };

      this.setState({
        loading: false,
        traceData: mockData,
        validationStatus: 'valid'
      });
    }, 1000);
  }

  handleRefresh() {
    this.setState({ loading: true });
    const batchNo = this.getBatchNoFromUrl();
    this.loadTraceData(batchNo);
  }

  renderHeader() {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #bb7b43 0%, #8b5a2b 100%)',
        padding: '48px 24px 40px',
        textAlign: 'center',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          zIndex: 0
        }} />
        <div style={{
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
          zIndex: 0
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            width: 120,
            height: 120,
            margin: '0 auto 16px',
            background: '#fff',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            overflow: 'hidden'
          }}>
            <img
              src="/logo.png"
              alt="古麒绒材"
              style={{
                width: 100,
                height: 100,
                objectFit: 'contain'
              }}
            />
          </div>
          <h1 style={{
            fontSize: 24,
            fontWeight: 600,
            marginBottom: 8,
            color: '#ffffff'
          }}>
            古麒绒材
          </h1>
          <p style={{
            fontSize: 14,
            opacity: 0.9,
            color: '#ffffff'
          }}>
            产品溯源查询系统
          </p>
        </div>
      </div>
    );
  }

  renderValidationResult() {
    const { validationStatus } = this.state;

    const config = {
      valid: {
        icon: (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#52c41a" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="8 12 11 15 16 9"/>
          </svg>
        ),
        title: '正品验证通过',
        desc: '该产品为古麒绒材正品，请放心使用',
        tagColor: 'success',
        bgColor: '#f6ffed',
        borderColor: '#b7eb8f'
      },
      invalid: {
        icon: (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f5222d" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="8" y1="8" x2="16" y2="16"/>
            <line x1="16" y1="8" x2="8" y2="16"/>
          </svg>
        ),
        title: '无效二维码',
        desc: '该二维码不存在或已被伪造，请谨慎购买',
        tagColor: 'error',
        bgColor: '#fff1f0',
        borderColor: '#ffccc7'
      },
      expired: {
        icon: (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fa8c16" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        ),
        title: '批次已失效',
        desc: '该产品批次已过期或作废',
        tagColor: 'warning',
        bgColor: '#fffbe6',
        borderColor: '#ffe58f'
      }
    };

    const cfg = config[validationStatus];

    return (
      <div style={{ padding: '0 16px', marginTop: -24, position: 'relative', zIndex: 2 }}>
        <Card
          style={{
            background: cfg.bgColor,
            border: '1px solid ' + cfg.borderColor,
            borderRadius: 12,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}
          bodyStyle={{ padding: 24 }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ marginRight: 16 }}>
              {cfg.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                <Tag color={cfg.tagColor} style={{ marginRight: 8 }}>
                  {validationStatus === 'valid' ? '正品' : validationStatus === 'invalid' ? '无效' : '已失效'}
                </Tag>
                <span style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: '#262626'
                }}>
                  {cfg.title}
                </span>
              </div>
              <p style={{
                fontSize: 13,
                color: '#595959',
                margin: 0
              }}>
                {cfg.desc}
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // 1. 产品信息
  renderProductInfo() {
    const { traceData } = this.state;

    if (!traceData || !traceData.productInfo) return null;

    const { productInfo } = traceData;

    return (
      <div style={{ padding: '0 16px', marginTop: 16 }}>
        <Card
          title={
            <span style={{ fontSize: 16, fontWeight: 600, color: '#262626' }}>
              产品信息
            </span>
          }
          style={{
            background: '#ffffff',
            border: '1px solid #e8e8e8',
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}
          headStyle={{
            borderBottom: '1px solid #f0f0f0',
            padding: '16px 20px'
          }}
          bodyStyle={{ padding: 20 }}
        >
          <Descriptions
            column={1}
            labelStyle={{ color: '#595959', fontSize: 14 }}
            contentStyle={{ color: '#262626', fontSize: 14, fontWeight: 500 }}
          >
            <Descriptions.Item label="产品名称">{productInfo.name}</Descriptions.Item>
            <Descriptions.Item label="规格">{productInfo.specification}</Descriptions.Item>
            <Descriptions.Item label="执行标准">{productInfo.execStandard}</Descriptions.Item>
            <Descriptions.Item label="产品标准类别">{productInfo.standardCategory}</Descriptions.Item>
            <Descriptions.Item label="生产年度">{productInfo.produceYear}</Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
    );
  }

  // 2. 质检信息
  renderQualityInfo() {
    const { traceData } = this.state;

    if (!traceData || !traceData.qualityInfo) return null;

    const { qualityInfo } = traceData;

    const metrics = [
      { label: '绒子含量', value: qualityInfo.downContent, color: '#52c41a', bgColor: '#f6ffed', borderColor: '#b7eb8f' },
      { label: '浊度', value: qualityInfo.turbidity, color: '#1890ff', bgColor: '#e6f7ff', borderColor: '#91d5ff' },
      { label: '气味', value: qualityInfo.odor, color: '#fa8c16', bgColor: '#fff7e6', borderColor: '#ffd591' },
      { label: '蓬松度', value: qualityInfo.fluffiness, color: '#722ed1', bgColor: '#f9f0ff', borderColor: '#d3adf7' }
    ];

    return (
      <div style={{ padding: '0 16px', marginTop: 16 }}>
        <Card
          title={
            <span style={{ fontSize: 16, fontWeight: 600, color: '#262626' }}>
              质检信息
            </span>
          }
          style={{
            background: '#ffffff',
            border: '1px solid #e8e8e8',
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}
          headStyle={{
            borderBottom: '1px solid #f0f0f0',
            padding: '16px 20px'
          }}
          bodyStyle={{ padding: 16 }}
        >
          <Row gutter={[12, 12]}>
            {metrics.map((item, index) => (
              <Col span={6} key={index}>
                <div style={{
                  background: item.bgColor,
                  border: '1px solid ' + item.borderColor,
                  borderRadius: 8,
                  padding: 16,
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: 12,
                    color: '#595959',
                    marginBottom: 8
                  }}>
                    {item.label}
                  </div>
                  <div style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: item.color
                  }}>
                    {item.value}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Card>
      </div>
    );
  }

  // 3. 产品视频
  renderProductVideos() {
    const { traceData } = this.state;

    if (!traceData || !traceData.videos || traceData.videos.length === 0) return null;

    return (
      <div style={{ padding: '0 16px', marginTop: 16 }}>
        <Card
          title={
            <span style={{ fontSize: 16, fontWeight: 600, color: '#262626' }}>
              产品视频
            </span>
          }
          style={{
            background: '#ffffff',
            border: '1px solid #e8e8e8',
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}
          headStyle={{
            borderBottom: '1px solid #f0f0f0',
            padding: '16px 20px'
          }}
          bodyStyle={{ padding: 16 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {traceData.videos.map((video, index) => (
              <div key={index} style={{
                position: 'relative',
                borderRadius: 8,
                overflow: 'hidden',
                background: '#f5f5f5'
              }}>
                <img
                  src={video.cover}
                  alt={video.title}
                  style={{
                    width: '100%',
                    height: 180,
                    objectFit: 'cover'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 60,
                  height: 60,
                  background: 'rgba(0,0,0,0.6)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '12px 16px',
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 500
                }}>
                  {video.title}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  // 4. 认证信息
  renderCertification() {
    const { traceData } = this.state;

    if (!traceData || !traceData.certifications || traceData.certifications.length === 0) return null;

    return (
      <div style={{ padding: '0 16px', marginTop: 16 }}>
        <Card
          title={
            <span style={{ fontSize: 16, fontWeight: 600, color: '#262626' }}>
              认证信息
            </span>
          }
          style={{
            background: '#ffffff',
            border: '1px solid #e8e8e8',
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}
          headStyle={{
            borderBottom: '1px solid #f0f0f0',
            padding: '16px 20px'
          }}
          bodyStyle={{ padding: 16 }}
        >
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            justifyContent: 'center'
          }}>
            {traceData.certifications.map((cert, index) => (
              <div key={index} style={{
                width: 'calc(33.33% - 8px)',
                minWidth: 100,
                textAlign: 'center'
              }}>
                <img
                  src={cert.img}
                  alt={cert.name}
                  style={{
                    width: '100%',
                    height: 120,
                    objectFit: 'contain',
                    borderRadius: 8,
                    background: '#fafafa',
                    border: '1px solid #f0f0f0'
                  }}
                />
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  // 5. 企业信息
  renderCompanyInfo() {
    const { traceData } = this.state;

    if (!traceData || !traceData.companyInfo) return null;

    const { companyInfo } = traceData;

    return (
      <div style={{ padding: '0 16px', marginTop: 16 }}>
        <Card
          title={
            <span style={{ fontSize: 16, fontWeight: 600, color: '#262626' }}>
              企业信息
            </span>
          }
          style={{
            background: '#ffffff',
            border: '1px solid #e8e8e8',
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}
          headStyle={{
            borderBottom: '1px solid #f0f0f0',
            padding: '16px 20px'
          }}
          bodyStyle={{ padding: 20 }}
        >
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <h3 style={{
              fontSize: 18,
              fontWeight: 600,
              color: '#262626',
              marginBottom: 16
            }}>
              {companyInfo.name}
            </h3>
            <img
              src={companyInfo.wechatQr}
              alt="微信公众号"
              style={{
                width: 120,
                height: 120,
                borderRadius: 8,
                border: '1px solid #e8e8e8'
              }}
            />
            <p style={{
              fontSize: 12,
              color: '#8c8c8c',
              marginTop: 8
            }}>
              扫码关注公众号
            </p>
          </div>

          <Button
            type="primary"
            block
            onClick={() => window.open(companyInfo.website, '_blank')}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 8 }}>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
            }
          >
            访问企业官网
          </Button>
        </Card>
      </div>
    );
  }

  renderFooter() {
    return (
      <div style={{
        padding: '32px 16px',
        textAlign: 'center',
        background: '#f5f5f5',
        marginTop: 24
      }}>
        <p style={{
          fontSize: 12,
          color: '#8c8c8c',
          margin: '0 0 8px'
        }}>
          数据来源：古麒绒材MES系统
        </p>
        <p style={{
          fontSize: 12,
          color: '#8c8c8c',
          margin: 0
        }}>
          版权所有 © 安徽古麒绒材股份有限公司
        </p>
      </div>
    );
  }

  renderLoading() {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f5',
        padding: '60px 24px'
      }}>
        <Spin size="large" />
        <p style={{
          marginTop: 16,
          color: '#595959',
          fontSize: 14
        }}>
          正在验证产品信息...
        </p>
      </div>
    );
  }

  renderError() {
    const { error } = this.state;

    const errorConfig = {
      invalid_qr: {
        status: 'error',
        title: '无效二维码',
        subTitle: '该二维码信息不完整或格式错误，请检查产品真伪'
      },
      not_found: {
        status: '404',
        title: '批次不存在',
        subTitle: '未找到该批次的产品信息，请检查批次号是否正确'
      },
      expired: {
        status: 'warning',
        title: '批次已失效',
        subTitle: '该产品批次已过期或作废'
      }
    };

    const cfg = errorConfig[error] || errorConfig.invalid_qr;

    return (
      <div style={{
        background: '#f5f5f5',
        padding: '60px 24px'
      }}>
        <Result
          status={cfg.status}
          title={<span style={{ color: '#262626' }}>{cfg.title}</span>}
          subTitle={<span style={{ color: '#595959' }}>{cfg.subTitle}</span>}
          extra={
            <Button type="primary" onClick={() => this.handleRefresh()}>
              重新查询
            </Button>
          }
        />
      </div>
    );
  }

  renderContent() {
    const { loading, error } = this.state;

    if (loading) {
      return this.renderLoading();
    }

    if (error) {
      return this.renderError();
    }

    return (
      <div>
        {this.renderHeader()}
        {this.renderValidationResult()}
        {this.renderProductInfo()}
        {this.renderQualityInfo()}
        {this.renderProductVideos()}
        {this.renderCertification()}
        {this.renderCompanyInfo()}
        {this.renderFooter()}
      </div>
    );
  }

  render() {
    return (
      <ConfigProvider>
        <div style={{
          maxWidth: 480,
          margin: '0 auto',
          background: '#f5f5f5'
        }}>
          {this.renderContent()}
        </div>
      </ConfigProvider>
    );
  }
}

export default WechatTrace;
